import type { LectureExample, VisualLine } from "../content/lectureExamples";
import { JavaScriptCode } from "./JavaScriptCode";

export function LectureFigure({
  code,
  example,
}: {
  code: string;
  example: LectureExample;
}) {
  const browserPage = example.renderHtml
    ? `<!doctype html><html lang="ru"><meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
        <style>
          body { margin: 0; font: 14px/1.4 system-ui,sans-serif; color: #261d34; }
          h1 { margin: 0 0 7px; font-size: 19px; }
          p { margin: 0 0 10px; }
          button { padding: 6px 11px; border: 0; border-radius: 6px; color: white; background: #6741ad; font: inherit; }
        </style><body>${code}</body></html>`
    : "";

  return (
    <figure className="lecture-figure">
      <div className="lecture-figure-grid">
        <div className="lecture-figure-source">
          <div className="lecture-figure-label">
            {example.renderHtml ? "HTML" : "JavaScript"}
          </div>
          <pre>
            {example.renderHtml ? (
              <code>{code}</code>
            ) : (
              <JavaScriptCode code={code} />
            )}
          </pre>
        </div>
        <div className="lecture-figure-result">
          {example.renderHtml && (
            <div className="lecture-visual-panel">
              <div className="lecture-figure-label">В браузере</div>
              <iframe
                title="Вид HTML в браузере"
                srcDoc={browserPage}
                sandbox=""
                tabIndex={-1}
              />
            </div>
          )}
          {example.panels.map((panel) => (
            <div className="lecture-visual-panel" key={panel.title}>
              <div className="lecture-figure-label">{panel.title}</div>
              <VisualLines lines={panel.lines} />
            </div>
          ))}
        </div>
      </div>
      <figcaption>{example.caption}</figcaption>
    </figure>
  );
}

function VisualLines({ lines }: { lines: VisualLine[] }) {
  return (
    <div className="lecture-visual-lines">
      {lines.map((line) => {
        if (typeof line === "string") return <span key={line}>{line}</span>;
        const [tone, text] = line;
        return (
          <span className={`lecture-visual-${tone}`} key={text}>
            {text}
          </span>
        );
      })}
    </div>
  );
}
