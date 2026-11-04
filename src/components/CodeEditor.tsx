import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/editor/editor.worker.js?worker";
import TsWorker from "monaco-editor/languages/features/typescript/ts.worker.js?worker";
import CssWorker from "monaco-editor/languages/features/css/css.worker.js?worker";
import HtmlWorker from "monaco-editor/languages/features/html/html.worker.js?worker";
import JsonWorker from "monaco-editor/languages/features/json/json.worker.js?worker";
(globalThis as any).MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "typescript" || label === "javascript") return new TsWorker();
    if (label === "css" || label === "scss") return new CssWorker();
    if (label === "html") return new HtmlWorker();
    if (label === "json") return new JsonWorker();
    return new EditorWorker();
  },
};
loader.config({ monaco });
monaco.editor.defineTheme("top-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "849b7e" },
    { token: "keyword", foreground: "c99ef4" },
    { token: "string", foreground: "e5cb85" },
  ],
  colors: {
    "editor.background": "#211e28",
    "editorLineNumber.foreground": "#786b86",
    "editor.lineHighlightBackground": "#302938",
    "editorCursor.foreground": "#c49bf1",
    "editor.selectionBackground": "#64417a88",
  },
});
export const languageFor = (file: string) =>
  file.endsWith(".tsx")
    ? "typescript"
    : file.endsWith(".jsx")
      ? "javascript"
      : file.endsWith(".ts")
        ? "typescript"
        : file.endsWith(".html")
          ? "html"
          : file.endsWith(".scss")
            ? "scss"
            : file.endsWith(".css")
              ? "css"
              : file.endsWith(".json")
                ? "json"
                : "javascript";
export function CodeEditor({
  file,
  value,
  onChange,
  readOnly = false,
}: {
  file: string;
  value: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
}) {
  return (
    <Editor
      path={file}
      language={languageFor(file)}
      value={value}
      onChange={(v) => onChange(v || "")}
      theme="top-dark"
      loading={<div className="editor-loading">Открываем редактор…</div>}
      options={{
        readOnly,
        fontSize: 14,
        lineHeight: 23,
        fontFamily: "Consolas, monospace",
        minimap: { enabled: false },
        automaticLayout: true,
        padding: { top: 18 },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        accessibilitySupport: "on",
        ariaLabel: "Редактор кода " + file,
      }}
    />
  );
}
