import { tokenizer, type Token } from "acorn";
import { Fragment, type ReactNode } from "react";

type CodeSpan = { start: number; end: number; color: string };

function tokenColor({ type }: Token, previous: string) {
  if (type.keyword) return "keyword";
  switch (type.label) {
    case "name":
      return previous === "." || previous === "?." || previous === "function"
        ? "property"
        : "";
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

function javascriptSpans(code: string) {
  const spans: CodeSpan[] = [];
  const lexer = tokenizer(code, {
    ecmaVersion: "latest",
    onComment(_block, _text, start, end) {
      spans.push({ start, end, color: "comment" });
    },
  });

  let previous = "";
  try {
    for (const token of lexer) {
      const color = tokenColor(token, previous);
      previous = token.type.label;
      if (color && token.start < token.end) {
        spans.push({ start: token.start, end: token.end, color });
      }
    }
  } catch {
    // Keep unfinished snippets readable if the tokenizer cannot finish.
  }
  return spans;
}

function htmlSpans(code: string) {
  const spans: CodeSpan[] = [];
  for (const { 0: tag, index } of code.matchAll(
    /<!--[\s\S]*?-->|<\/?[a-z](?:"[^"]*"|'[^']*'|[^"'<>])*>/gi,
  )) {
    if (tag.startsWith("<!--")) {
      spans.push({ start: index, end: index + tag.length, color: "comment" });
      continue;
    }
    const tagNamePosition = tag.startsWith("</") ? 2 : 1;
    for (const { 0: part, index: position } of tag.matchAll(
      /"[^"]*"|'[^']*'|[a-z_:][\w:.-]*/gi,
    )) {
      const color =
        position === tagNamePosition
          ? "keyword"
          : /^["']/.test(part) ? "string" : "property";
      const start = index + position;
      spans.push({ start, end: start + part.length, color });
    }
  }
  return spans;
}

export function SyntaxCode({
  code,
  language = "javascript",
}: {
  code: string;
  language?: "javascript" | "html";
}) {
  const spans = language === "html" ? htmlSpans(code) : javascriptSpans(code);
  const lines: ReactNode[][] = [[]];
  function append(text: string, color?: string) {
    text.split("\n").forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (!part) return;
      const line = lines[lines.length - 1];
      line.push(
        color ? (
          <span className={`syntax-${color}`} key={line.length}>
            {part}
          </span>
        ) : part,
      );
    });
  }
  let offset = 0;
  for (const { start, end, color } of spans) {
    append(code.slice(offset, start));
    append(code.slice(start, end), color);
    offset = end;
  }
  append(code.slice(offset));

  return (
    <code className="syntax-code">
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && "\n"}
          <span className="syntax-line">{line}</span>
        </Fragment>
      ))}
    </code>
  );
}
