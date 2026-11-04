import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { lessons } from "../content/course";
import type { Exercise } from "../content/types";
import { useProgress } from "../engine/persistence";
import { checkInSandbox } from "../engine/execution";
import { ConceptLab } from "../components/ConceptLab";
export function LessonPage() {
  const { id } = useParams();
  const lesson = lessons[Number(id) - 1];
  const { progress, update } = useProgress();
  const [tab, setTab] = useState("theory");
  const [section, setSection] = useState(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (lesson) update((p) => ({ ...p, current: lesson.id }));
    setTab("theory");
    setSection(0);
    setStep(0);
  }, [lesson?.id]);
  if (!lesson)
    return (
      <main className="standard-page">
        <h1>Занятие не найдено</h1>
        <Link to="/curriculum">Открыть программу</Link>
      </main>
    );
  const s = lesson.sections[section];
  return (
    <main className="lesson-layout">
      <aside className="lesson-sidebar">
        <Link to="/curriculum" className="text-link">
          <ArrowLeft size={15} /> Программа курса
        </Link>
        <div className="lesson-route">
          {lessons.map((l) => (
            <Link
              key={l.id}
              className={l.id === lesson.id ? "selected" : ""}
              to={`/lesson/${l.id}`}
            >
              <span>
                {progress.applied.includes(l.id) ? (
                  <Check size={15} />
                ) : (
                  String(l.id).padStart(2, "0")
                )}
              </span>
              <div>
                <small>День {l.day}</small>
                {l.title}
              </div>
            </Link>
          ))}
        </div>
        <p className="eyebrow">ПЛАН ПАРЫ · 90 МИН</p>
        <p className="muted small">
          Теория — 25 мин
          <br />
          Тренажёр — 20 мин
          <br />
          Проект NOVA — 35 мин
          <br />
          Итоги — 10 мин
        </p>
      </aside>
      <div className="lesson-main">
        <p className="eyebrow">
          JAVASCRIPT / ДЕНЬ {lesson.day} / ПАРА {lesson.id}
        </p>
        <h1>
          {lesson.title}
          <span className="corner" />
        </h1>
        <p className="lesson-goal">{lesson.goal}</p>
        <div className="tabs lesson-tabs">
          <button
            className={tab === "theory" ? "active" : ""}
            onClick={() => setTab("theory")}
          >
            <BookOpen size={17} />
            Теория
          </button>
          <button
            className={tab === "trainer" ? "active" : ""}
            onClick={() => setTab("trainer")}
          >
            <Play size={17} />
            Тренажёр{" "}
            <span className="count">
              {
                lesson.exercises.filter(
                  (_, i) => progress.exercises[`${lesson.id}-${i}`],
                ).length
              }
              /2
            </span>
          </button>
          <Link to={`/workspace/${lesson.id}`} className="button">
            <Code2 size={17} />
            Практика NOVA
          </Link>
        </div>
        {tab === "theory" ? (
          <>
            <div className="section-tabs">
              {lesson.sections.map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => setSection(i)}
                  className={section === i ? "selected" : ""}
                >
                  {progress.sections[`${lesson.id}-${i}`] ? (
                    <Check size={13} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {item.title}
                </button>
              ))}
            </div>
            <article className="theory">
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              <pre>
                <code>{s.code}</code>
              </pre>
              <div className="tip">
                <strong>Обрати внимание</strong>
                <p>{s.note}</p>
              </div>
              <div className="section-next">
                <span className="muted">
                  Раздел {section + 1} из {lesson.sections.length}
                </span>
                <button
                  onClick={() => {
                    update((p) => ({
                      ...p,
                      sections: {
                        ...p.sections,
                        [`${lesson.id}-${section}`]: true,
                      },
                    }));
                    if (section < 2) setSection(section + 1);
                    else setTab("trainer");
                  }}
                >
                  {section < 2 ? "Понятно, дальше" : "К упражнениям"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
            <ConceptLab key={lesson.id} id={lesson.id} />
            <div className="demo">
              <div className="spread">
                <h3>
                  <Terminal size={17} /> Выполнение по шагам
                </h3>
                <span className="pill">
                  Шаг {step}/{lesson.demo.code.length}
                </span>
              </div>
              <div className="demo-grid">
                <div className="demo-code">
                  {lesson.demo.code.map((line, i) => (
                    <div className={step === i + 1 ? "executing" : ""} key={i}>
                      <span>{i + 1}</span>
                      <code>{line}</code>
                    </div>
                  ))}
                </div>
                <div className="memory">
                  <span className="eyebrow">СОСТОЯНИЕ ПРОГРАММЫ</span>
                  <p aria-live="polite">{lesson.demo.states[step]}</p>
                  {lesson.id === 5 && (
                    <div className="dom-tree">
                      document
                      <br />└ main
                      <br />
                      　└ #speakers-list
                      {step === 4 && (
                        <>
                          <br />
                          　　└ article «Анна»
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="demo-actions">
                <button
                  onClick={() => setStep(0)}
                  aria-label="Сбросить демонстрацию"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  className="primary"
                  onClick={() =>
                    setStep((n) => Math.min(n + 1, lesson.demo.code.length))
                  }
                  disabled={step === lesson.demo.code.length}
                >
                  <Play size={15} />
                  Выполнить строку
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="exercises">
            <p className="muted">
              Небольшие задачи перед большим проектом. Измени код и проверь его
              на нескольких входных данных.
            </p>
            {lesson.exercises.map((e, i) => (
              <MiniExercise
                key={`${lesson.id}-${i}`}
                exercise={e}
                lessonId={lesson.id}
                index={i}
              />
            ))}
          </div>
        )}
        <div className="lesson-summary">
          <p className="eyebrow">ЧТО ДОБАВИШЬ В NOVA</p>
          <h3>{lesson.feature}</h3>
          <p>{lesson.summary}</p>
          <Link className="button primary" to={`/workspace/${lesson.id}`}>
            Открыть практику <ArrowRight size={16} />
          </Link>
        </div>
        <div className="spread lesson-footer">
          {lesson.id > 1 ? (
            <Link className="text-link" to={`/lesson/${lesson.id - 1}`}>
              <ArrowLeft size={15} />
              Предыдущее занятие
            </Link>
          ) : (
            <span />
          )}
          {lesson.id < 9 ? (
            <Link className="text-link" to={`/lesson/${lesson.id + 1}`}>
              Следующее занятие
              <ArrowRight size={15} />
            </Link>
          ) : (
            <Link className="text-link" to="/project">
              Мой проект
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
function MiniExercise({
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
        <span className="eyebrow">УПРАЖНЕНИЕ {index + 1}</span>
        {progress.exercises[key] && (
          <span className="success">
            <Check size={16} />
            Выполнено
          </span>
        )}
      </div>
      <h3>{exercise.prompt}</h3>
      <textarea
        spellCheck={false}
        aria-label={`Код упражнения ${index + 1}`}
        value={code}
        onChange={(e) => {
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
        <button onClick={() => setHint(!hint)}>Подсказка</button>
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
          <summary>Эталон</summary>
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
