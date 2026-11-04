import { parse } from "acorn";
import { full } from "acorn-walk";
import MagicString from "magic-string";
// Instrument loops and function entry points so common accidental infinite loops
// cannot monopolize the browser. No user code executes in the parent document.
export function instrument(code: string): string {
  if (code.length > 100_000)
    throw new Error("Слишком большой файл: максимум 100 000 символов.");
  const ast = parse(code, { ecmaVersion: "latest", sourceType: "script" });
  const output = new MagicString(code);
  full(ast, (node: any) => {
    if (
      [
        "WhileStatement",
        "ForStatement",
        "ForInStatement",
        "ForOfStatement",
        "DoWhileStatement",
      ].includes(node.type)
    ) {
      if (node.body.type === "BlockStatement")
        output.appendLeft(node.body.start + 1, "__topGuard();");
      else {
        output.prependLeft(node.body.start, "{__topGuard();");
        output.appendRight(node.body.end, "}");
      }
    }
    if (
      [
        "FunctionDeclaration",
        "FunctionExpression",
        "ArrowFunctionExpression",
      ].includes(node.type)
    ) {
      if (node.body.type === "BlockStatement")
        output.appendLeft(node.body.start + 1, "__topGuard();");
      else {
        output.prependLeft(node.body.start, "(__topGuard(),");
        output.appendRight(node.body.end, ")");
      }
    }
  });
  return output.toString();
}
export const guardScript = `let __topDeadline = performance.now() + 250;
function __topGuard(){if(performance.now()>__topDeadline) throw new Error('Превышено время выполнения. Проверьте условия циклов и рекурсию.');}
setInterval(()=>{__topDeadline=performance.now()+250;},100);`;
