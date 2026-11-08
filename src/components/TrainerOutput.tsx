import { useEffect, useMemo, useState } from "react";
import { Eye, Play } from "lucide-react";
import { trainerExampleFiles, type TrainerExample } from "../content/trainerExamples";
import { Preview } from "./Preview";

const noStages = {};

export function TrainerOutput({ example, code }: { example: TrainerExample; code: string }) {
  const [run, setRun] = useState({ code, revision: 0 });
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  function launch(next: string) {
    setError("");
    setLogs([]);
    setRun((current) => ({ code: next, revision: current.revision + 1 }));
  }

  useEffect(() => {
    if (code === run.code) return;
    const timer = window.setTimeout(() => launch(code), 600);
    return () => window.clearTimeout(timer);
  }, [code, run.code]);

  const files = useMemo(() => trainerExampleFiles(example, run.code), [example, run.code]);
  return (
    <section className="trainer-output" aria-label="Результат кода" aria-busy={code !== run.code}>
      <div className="trainer-output-bar">
        <strong><Eye size={15} aria-hidden /> Результат кода</strong>
        <button type="button" onClick={() => launch(code)}>
          <Play size={13} aria-hidden /> Запустить пример
        </button>
      </div>
      <p className="trainer-output-instruction">{example.instruction}</p>
      <div className="trainer-output-preview">
        <Preview
          key={run.revision}
          page="index"
          codes={noStages}
          files={files}
          title="Результат упражнения"
          onError={(message) => setError(message.replace("scripts/stage-10.js", "JavaScript"))}
          onLog={(line) => setLogs((current) => [...current.slice(-14), line])}
        />
      </div>
      {error && <p className="trainer-output-error" role="alert">{error}</p>}
      {logs.length > 0 && (
        <details className="trainer-output-logs">
          <summary>Консоль</summary>
          <pre>{logs.join("\n")}</pre>
        </details>
      )}
    </section>
  );
}
