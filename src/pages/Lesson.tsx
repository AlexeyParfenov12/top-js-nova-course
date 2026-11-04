import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  ListChecks,
  Play,
  RotateCcw,
  Terminal,
  Target,
} from "lucide-react";
import { lessons } from "../content/course";
import { sessionAgenda } from "../content/depth";
import { useProgress } from "../engine/persistence";
import { lessonStats } from "../engine/learning";
import { ConceptLab } from "../components/ConceptLab";
import { PracticeExercise } from "../components/PracticeExercise";
import { KnowledgeReview } from "../components/KnowledgeReview";
import { ProgressBar } from "../components/common";
export function LessonPage() {
  const { id } = useParams();
  const lesson = lessons[Number(id) - 1];
  const { progress, update } = useProgress();
  const [tab, setTab] = useState("theory");
  const [section, setSection] = useState(0);
  const [step, setStep] = useState(0);
  const [warmup, setWarmup] = useState(true);
  useEffect(() => {
    if (lesson) update((p) => ({ ...p, current: lesson.id }));
    setTab("theory");
    setSection(0);
    setStep(0);
    setWarmup(true);
  }, [lesson?.id]);
  if (!lesson)
    return (
      <main className="standard-page">
        <h1>Занятие не найдено</h1>
        <Link to="/curriculum">Открыть программу</Link>
      </main>
    );
  const s = lesson.sections[section];
  const stats = lessonStats(lesson, progress);
  function readNext() {
    update((p) => ({
      ...p,
      sections: { ...p.sections, [`${lesson.id}-${section}`]: true },
    }));
    if (section < lesson.sections.length - 1) setSection(section + 1);
    else setTab("trainer");
  }
  return (
    <main className="lesson-layout">
      <aside className="lesson-sidebar">
        <Link to="/curriculum" className="text-link">
          <ArrowLeft size={14} />К программе
        </Link>
        <div className="lesson-side-title">
          <span>
            ДЕНЬ {lesson.day} / ПАРА {String(lesson.id).padStart(2, "0")}
          </span>
          <strong>{lesson.title}</strong>
        </div>
        <p className="eyebrow">СОДЕРЖАНИЕ ЗАНЯТИЯ</p>
        <div className="reading-nav">
          {lesson.sections.map((item, i) => (
            <button
              key={item.title}
              className={tab === "theory" && section === i ? "selected" : ""}
              aria-current={
                tab === "theory" && section === i ? "step" : undefined
              }
              onClick={() => {
                setSection(i);
                setTab("theory");
              }}
            >
              <span
                className={progress.sections[`${lesson.id}-${i}`] ? "read" : ""}
              >
                {progress.sections[`${lesson.id}-${i}`] ? (
                  <Check size={12} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              {item.title}
            </button>
          ))}
        </div>
        <div className="side-stage-links">
          <button onClick={() => setTab("trainer")}>
            <Code2 size={15} />
            Тренажёр{" "}
            <span>
              {stats.practice}/{lesson.exercises.length}
            </span>
          </button>
          <button onClick={() => setTab("review")}>
            <ListChecks size={15} />
            Контроль{" "}
            <span>
              {stats.quiz}/{lesson.quiz.length}
            </span>
          </button>
          <Link to={`/workspace/${lesson.id}`}>
            <Terminal size={15} />
            Практика NOVA <ArrowRight size={14} />
          </Link>
        </div>
        <details className="all-lessons">
          <summary>Все 9 занятий</summary>
          <div className="lesson-route">
            {lessons.map((l) => (
              <Link
                key={l.id}
                className={l.id === lesson.id ? "selected" : ""}
                to={`/lesson/${l.id}`}
              >
                <span>
                  {progress.applied.includes(l.id) ? (
                    <Check size={13} />
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
        </details>
      </aside>
      <div className="lesson-main">
        <div className="lesson-topline">
          <p className="eyebrow">
            JAVASCRIPT / ДЕНЬ {lesson.day} / ПАРА {lesson.id}
          </p>
          <span>
            <Clock3 size={13} />
            90 минут · в своём темпе
          </span>
        </div>
        <h1>{lesson.title}</h1>
        <p className="lesson-goal">{lesson.goal}</p>
        <div className="lesson-resource-counts">
          <span>
            <BookOpen size={14} />
            {lesson.sections.length} разделов
          </span>
          <span>
            <Code2 size={14} />
            {lesson.exercises.length} задач с кодом
          </span>
          <span>
            <ListChecks size={14} />
            {lesson.quiz.length} вопроса
          </span>
        </div>
        <div className="tabs lesson-tabs">
          <button
            aria-pressed={tab === "theory"}
            className={tab === "theory" ? "active" : ""}
            onClick={() => setTab("theory")}
          >
            <BookOpen size={16} />
            Теория
            <span className="count">
              {stats.reading}/{lesson.sections.length}
            </span>
          </button>
          <button
            aria-pressed={tab === "trainer"}
            className={tab === "trainer" ? "active" : ""}
            onClick={() => setTab("trainer")}
          >
            <Play size={16} />
            Тренажёр
            <span className="count">
              {stats.practice}/{lesson.exercises.length}
            </span>
          </button>
          <button
            aria-pressed={tab === "review"}
            className={tab === "review" ? "active" : ""}
            onClick={() => setTab("review")}
          >
            <ListChecks size={16} />
            Контроль
            <span className="count">
              {stats.quiz}/{lesson.quiz.length}
            </span>
          </button>
          <Link className="button" to={`/workspace/${lesson.id}`}>
            <Code2 size={16} />
            Практика NOVA
          </Link>
        </div>
        {tab === "theory" ? (
          <>
            <details
              className="warmup-card"
              open={warmup}
              onToggle={(event) => setWarmup(event.currentTarget.open)}
            >
              <summary>
                <span className="warmup-label">ПЕРЕД НАЧАЛОМ</span>Разминка на 5
                минут
              </summary>
              <p>{lesson.guide.warmup}</p>
              <small>
                <b>Что уже пригодится:</b> {lesson.guide.prerequisite}
              </small>
            </details>
            <article className="theory lesson-reading">
              <div className="reading-meta">
                <span>
                  РАЗДЕЛ {String(section + 1).padStart(2, "0")} /{" "}
                  {lesson.sections.length}
                </span>
                {progress.sections[`${lesson.id}-${section}`] && (
                  <span className="success">
                    <Check size={13} />
                    Прочитано
                  </span>
                )}
              </div>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              <div className="lesson-code">
                <div className="code-caption">
                  <span>Пример</span>
                  <span>
                    {s.code.startsWith("@media") ? "CSS" : "JavaScript"} /
                    разбор
                  </span>
                </div>
                <pre>
                  <code>{s.code}</code>
                </pre>
              </div>
              {s.walkthrough && (
                <div className="code-walkthrough">
                  <h3>Разберём по действиям</h3>
                  <ol>
                    {s.walkthrough.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </div>
              )}
              <div className="tip">
                <strong>Частая ошибка / обрати внимание</strong>
                <p>{s.note}</p>
              </div>
              {s.prediction && (
                <details className="prediction">
                  <summary>Сначала предскажи результат</summary>
                  <p>{s.prediction.prompt}</p>
                  <details>
                    <summary>Сравнить с объяснением</summary>
                    <p>{s.prediction.answer}</p>
                  </details>
                </details>
              )}
              <div className="experiment">
                <span>ПОПРОБУЙ САМ</span>
                <p>
                  {s.experiment ||
                    "Прочитай пример по строкам. Предскажи результат, затем измени одно значение и проверь, что меняется. Объясни результат своими словами перед переходом дальше."}
                </p>
              </div>
              <div className="section-next">
                <span className="muted">
                  Раздел {section + 1} из {lesson.sections.length}
                </span>
                <button className="primary" onClick={readNext}>
                  {section < lesson.sections.length - 1
                    ? "Понятно, дальше"
                    : "К упражнениям"}
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
            <ConceptLab key={lesson.id} id={lesson.id} />
            <section className="demo">
              <div className="spread">
                <h3>
                  <Terminal size={17} />
                  Выполнение по шагам
                </h3>
                <span className="pill">
                  Шаг {step}/{lesson.demo.code.length}
                </span>
              </div>
              <p className="demo-description">
                Сначала назови ожидаемое состояние. Выполни шаг и сравни с
                объяснением.
              </p>
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
                  aria-label="Сбросить демонстрацию"
                  onClick={() => setStep(0)}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  className="primary"
                  disabled={step === lesson.demo.code.length}
                  onClick={() =>
                    setStep((n) => Math.min(n + 1, lesson.demo.code.length))
                  }
                >
                  <Play size={15} />
                  Выполнить строку
                </button>
              </div>
            </section>
          </>
        ) : tab === "trainer" ? (
          <div className="exercises">
            <div className="learning-section-head">
              <span className="section-icon">
                <Code2 size={22} />
              </span>
              <div>
                <p className="eyebrow">ПИШЕМ КОД / 20 МИНУТ</p>
                <h2>От простого к самостоятельному.</h2>
                <p>
                  Сначала реши две задачи на основу, затем закрепи правило и
                  примени его в DOM. Подсказки и эталон доступны, если застрял.
                </p>
              </div>
            </div>
            {lesson.exercises.map((e, i) => (
              <PracticeExercise
                key={`${lesson.id}-${i}`}
                exercise={e}
                lessonId={lesson.id}
                index={i}
              />
            ))}
          </div>
        ) : (
          <KnowledgeReview key={lesson.id} lesson={lesson} />
        )}
        <section className="lesson-project-brief">
          <div className="project-brief-heading">
            <span className="section-icon">
              <Target size={23} />
            </span>
            <div>
              <p className="eyebrow">ТВОЙ ПРОЕКТ / 30 МИНУТ</p>
              <h2>{lesson.feature}</h2>
            </div>
          </div>
          <p>{lesson.task}</p>
          <ol>
            {lesson.guide.milestones.map((item, i) => (
              <li key={item}>
                <span>{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <div className="brief-bottom">
            <p>{lesson.summary}</p>
            <Link className="button primary" to={`/workspace/${lesson.id}`}>
              Открыть практику
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <div className="spread lesson-footer">
          {lesson.id > 1 ? (
            <Link className="text-link" to={`/lesson/${lesson.id - 1}`}>
              <ArrowLeft size={14} />
              Предыдущее занятие
            </Link>
          ) : (
            <span />
          )}
          {lesson.id < lessons.length ? (
            <Link className="text-link" to={`/lesson/${lesson.id + 1}`}>
              Следующее занятие
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link className="text-link" to="/project">
              Мой проект
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
      <aside className="lesson-guide">
        <div className="lesson-guide-progress">
          <span className="eyebrow">ПРОГРЕСС ЗАНЯТИЯ</span>
          <strong>
            {stats.done}
            <small> / {stats.total} шагов</small>
          </strong>
          <ProgressBar value={stats.percent} />
          <p>Разделы, упражнения, вопросы, самооценка и этап проекта.</p>
        </div>
        <div className="agenda-card">
          <h3>
            План пары <span>90 мин</span>
          </h3>
          <ol>
            {sessionAgenda.map((phase, i) => (
              <li key={phase.title}>
                {phase.tab === "workspace" ? (
                  <Link to={`/workspace/${lesson.id}`}>
                    <span className="agenda-dot">{i + 1}</span>
                    <div>
                      <strong>{phase.title}</strong>
                      <small>{phase.description}</small>
                    </div>
                    <b>{phase.minutes}′</b>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setTab(phase.tab);
                      if (i === 0) setWarmup(true);
                    }}
                  >
                    <span className="agenda-dot">{i + 1}</span>
                    <div>
                      <strong>{phase.title}</strong>
                      <small>{phase.description}</small>
                    </div>
                    <b>{phase.minutes}′</b>
                  </button>
                )}
              </li>
            ))}
          </ol>
          <p>
            Ориентир для работы с примерами. Можно пройти быстрее или
            задержаться на сложной теме.
          </p>
        </div>
        <div className="lesson-guide-target">
          <Target size={19} />
          <span>РЕЗУЛЬТАТ В NOVA</span>
          <p>{lesson.feature}</p>
          {stats.project ? (
            <div className="success">
              <CheckCircle2 size={14} />
              Этап уже добавлен
            </div>
          ) : (
            <Link className="text-link" to={`/workspace/${lesson.id}`}>
              Перейти к заданию
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </aside>
    </main>
  );
}
