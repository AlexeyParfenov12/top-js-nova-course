import { tokenizer, type Token } from "acorn";

function tokenColor({ type }: Token) {
  if (type.keyword) return "keyword";
  switch (type.label) {
    case "num":
      return "number";
    case "string":
    case "template":
    case "`":
    case "regexp":
      return "string";
    default:
      return "";
  }
}

export function JavaScriptCode({ code }: { code: string }) {
  const spans: { start: number; end: number; color: string }[] = [];
  const lexer = tokenizer(code, {
    ecmaVersion: "latest",
    onComment(_block, _text, start, end) {
      spans.push({ start, end, color: "comment" });
    },
  });

  try {
    for (const token of lexer) {
      const color = tokenColor(token);
      if (color && token.start < token.end) {
        spans.push({ start: token.start, end: token.end, color });
      }
    }
  } catch {
    // Keep unfinished snippets readable if the tokenizer cannot finish.
  }

  let offset = 0;
  return (
    <code className="javascript-code">
      {spans.map(({ start, end, color }) => {
        const plain = code.slice(offset, start);
        offset = end;
        return (
          <span key={start}>
            {plain}
            <span className={`js-${color}`}>{code.slice(start, end)}</span>
          </span>
        );
      })}
      {code.slice(offset)}
    </code>
  );
}
