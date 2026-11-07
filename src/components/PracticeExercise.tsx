import { useState } from "react";
import { Check, Lightbulb, RotateCcw } from "lucide-react";
import type { Exercise } from "../content/types";
import { useProgress } from "../engine/persistence";
import { checkInSandbox } from "../engine/execution";
import { CodeEditor } from "./CodeEditor";
import { JavaScriptCode } from "./JavaScriptCode";
export default function PracticeExercise({
  exercise,
  lessonId,
  index,
}: {
  exercise: Exercise;
  lessonId: number;
  index: number;
}) {
  const { progress, update } = useProgress();
  const key = `${lessonId}-${exercise.slot}`;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState(false);
  const code = progress.exerciseDrafts[key] ?? exercise.starter;
  async function check() {
    setBusy(true);
    const results = await checkInSandbox(
      "index",
      {},
      { "scripts/stage-10.js": code },
      `test('Упражнение',()=>{${exercise.tests}});`,
    );
    const passed = results.length > 0 && results.every((r) => r.passed);
    update((p) =>
      (p.exerciseDrafts[key] ?? exercise.starter) === code
        ? { ...p, exercises: { ...p.exercises, [key]: passed } }
        : p,
    );
    setMessage(
      passed
        ? "Верно! Все сценарии пройдены."
        : results
            .filter((r) => !r.passed)
            .map((r) => r.detail)
            .join(" · "),
    );
    setBusy(false);
  }
  return (
    <article className="exercise">
      <div className="spread">
        <h2>{exercise.title}</h2>
        {progress.exercises[key] && (
          <span className="success">
            <Check size={16} />
            Выполнено
          </span>
        )}
      </div>
      <p>{exercise.prompt}</p>
      <div className="mini-editor-caption">
        <span>JavaScript</span>
        <span>Подсказки при вводе · Ctrl+Пробел</span>
      </div>
      <div className="trainer-editor">
        <CodeEditor
          file={`trainer/lesson-${lessonId}/exercise-${exercise.slot}.js`}
          readOnly={busy}
          ariaLabel={`Код упражнения ${index + 1}`}
          value={code}
          onSizeLimit={() =>
            setMessage("Размер файла ограничен 100 000 символов.")
          }
          onChange={(nextCode) => {
            update((p) => ({
              ...p,
              exerciseDrafts: { ...p.exerciseDrafts, [key]: nextCode },
              exercises: { ...p.exercises, [key]: false },
            }));
            setMessage("");
          }}
        />
      </div>
      <div className="exercise-actions">
        <button className="primary" onClick={check} disabled={busy}>
          {busy ? "Проверяем…" : "Проверить"}
        </button>
        <button onClick={() => setHint(!hint)}>
          <Lightbulb size={14} />
          Подсказка
        </button>
        <button
          aria-label={`Сбросить упражнение ${index + 1}`}
          disabled={busy}
          onClick={() => {
            update((p) => ({
              ...p,
              exerciseDrafts: { ...p.exerciseDrafts, [key]: exercise.starter },
              exercises: { ...p.exercises, [key]: false },
            }));
            setMessage("");
          }}
        >
          <RotateCcw size={14} />
        </button>
        <details>
          <summary>Посмотреть эталон</summary>
          <pre>
            <JavaScriptCode code={exercise.solution} />
          </pre>
        </details>
      </div>
      {hint && <p className="tip">{exercise.hint}</p>}
      {message && (
        <p
          role="status"
          className={progress.exercises[key] ? "success" : "error-text"}
        >
          {message}
        </p>
      )}
    </article>
  );
}
