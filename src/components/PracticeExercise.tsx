import { useState } from "react";
import { Check, Lightbulb, RotateCcw } from "lucide-react";
import type { Exercise } from "../content/types";
import { useProgress } from "../engine/persistence";
import { checkInSandbox } from "../engine/execution";
export function PracticeExercise({
  exercise,
  lessonId,
  index,
}: {
  exercise: Exercise;
  lessonId: number;
  index: number;
}) {
  const { progress, update } = useProgress();
  const key = `${lessonId}-${index}`;
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
    update((p) => ({ ...p, exercises: { ...p.exercises, [key]: passed } }));
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
    <article className="exercise panel">
      <div className="spread">
        <span className="exercise-tag">
          {String(index + 1).padStart(2, "0")} /{" "}
          {index < 2 ? "РАЗМИНКА" : index < 4 ? "ЗАКРЕПЛЕНИЕ" : "ПРИМЕНЕНИЕ"}
        </span>
        {progress.exercises[key] && (
          <span className="success">
            <Check size={16} />
            Выполнено
          </span>
        )}
      </div>
      <h3>{exercise.prompt}</h3>
      <div className="mini-editor-caption">
        <span>exercise-{index + 1}.js</span>
        <small>JavaScript · редактируемый код</small>
      </div>
      <textarea
        spellCheck={false}
        aria-label={`Код упражнения ${index + 1}`}
        value={code}
        onChange={(e) => {
          if (e.target.value.length > 100000) return;
          update((p) => ({
            ...p,
            exerciseDrafts: { ...p.exerciseDrafts, [key]: e.target.value },
            exercises: { ...p.exercises, [key]: false },
          }));
          setMessage("");
        }}
      />
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
          <pre>{exercise.solution}</pre>
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
