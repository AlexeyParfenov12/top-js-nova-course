import { useState } from "react";
import { Check, Lightbulb, RotateCcw } from "lucide-react";
import type { Exercise } from "../content/types";
import { taskSteps } from "../content/taskSteps";
import { useProgress } from "../engine/persistence";
import { checkInSandbox } from "../engine/execution";
import { useAutoCheck } from "../engine/useAutoCheck";
import { CodeEditor } from "./CodeEditor";
import { SyntaxCode } from "./SyntaxCode";
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
  async function check(manual: boolean, signal: AbortSignal) {
    if (manual) setBusy(true);
    setMessage(manual ? "Проверяем…" : "Автопроверка…");
    const results = await checkInSandbox(
      "index",
      {},
      { "scripts/stage-10.js": code },
      `test('Упражнение',()=>{${exercise.tests}});`,
      undefined,
      signal,
    );
    if (signal.aborted) return;
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
    if (manual) setBusy(false);
  }
  const autoCheck = useAutoCheck(check);
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
      <ol className="trainer-steps" aria-label="Шаги задания">
        {taskSteps[lessonId].trainer[index].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
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
            setMessage("Проверим после паузы в наборе…");
            autoCheck.schedule();
          }}
        />
      </div>
      <div className="exercise-actions">
        <button className="primary" onClick={autoCheck.checkNow} disabled={busy}>
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
            autoCheck.cancel();
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
            <SyntaxCode code={exercise.solution} />
          </pre>
        </details>
      </div>
      {hint && <p className="tip">{exercise.hint}</p>}
      {message && (
        <p
          role="status"
          className={
            message.endsWith("…")
              ? undefined
              : progress.exercises[key]
                ? "success"
                : "error-text"
          }
        >
          {message}
        </p>
      )}
    </article>
  );
}
