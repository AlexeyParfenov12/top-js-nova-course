import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Code2,
  Presentation,
} from "lucide-react";
import { lessons } from "../content/course";
import { pair, pairMinutes, sessions } from "../content/sessions";
import type { Lesson } from "../content/types";
import { useProgress } from "../engine/persistence";
import { PracticeExercise } from "../components/PracticeExercise";
import "../styles/classroom.css";

export function LessonPage() {
  const { id } = useParams();
  const lesson = lessons[Number(id) - 1];
  const { update } = useProgress();

  useEffect(() => {
    if (lesson) update((progress) => ({ ...progress, current: lesson.id }));
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <main className="standard-page">
        <h1>Занятие не найдено</h1>
        <Link to="/curriculum">Открыть программу</Link>
      </main>
    );
  }

  return <Classroom key={lesson.id} lesson={lesson} />;
}

function Classroom({ lesson }: { lesson: Lesson }) {
  const { progress } = useProgress();
  const [phase, setPhase] = useState<"lecture" | "trainer">("lecture");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const phaseNav = useRef<HTMLElement>(null);
  const session = sessions[lesson.id];
  const workspace = `/workspace/${lesson.id}`;
  const exercise = lesson.exercises[exerciseIndex];
  const pairOfDay = ((lesson.id - 1) % 3) + 1;

  function nextStep() {
    if (phase === "lecture") setPhase("trainer");
    else setExerciseIndex(1);
    phaseNav.current?.scrollIntoView({ block: "start" });
  }

  return (
    <main className="classroom">
      <div className="classroom-top">
        <Link to="/curriculum">
          <ArrowLeft size={15} /> К программе
        </Link>
        <span>
          <Clock3 size={15} /> {pairMinutes} минут
        </span>
      </div>
      <header className="classroom-heading">
        <p>
          ДЕНЬ {lesson.day} · ПАРА {pairOfDay} ИЗ 3
        </p>
        <h1>{lesson.title}</h1>
        <div>{lesson.goal}</div>
      </header>

      <nav
        ref={phaseNav}
        className="lesson-tabs classroom-phases"
        aria-label="Части пары"
      >
        <button
          aria-pressed={phase === "lecture"}
          onClick={() => setPhase("lecture")}
        >
          <span>01</span>
          <strong>Лекция</strong>
          <small>{pair.lecture} мин</small>
        </button>
        <button
          aria-pressed={phase === "trainer"}
          onClick={() => setPhase("trainer")}
        >
          <span>02</span>
          <strong>Тренажёр</strong>
          <small>{pair.trainer} мин</small>
        </button>
        <Link to={workspace}>
          <span>03</span>
          <strong>Практика NOVA</strong>
          <small>{pair.practice} мин</small>
        </Link>
      </nav>

      {phase === "lecture" ? (
        <>
          <section
            className="classroom-card classroom-lecture"
            aria-label="Лекция"
          >
            <div className="classroom-notes">
              <h2>
                <BookOpen size={19} /> Главное за пару
              </h2>
              <ol>
                {session.topics.map(([title, description]) => (
                  <li key={title}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="classroom-example">
              <h2>
                <Code2 size={19} /> Пример для разбора
              </h2>
              <pre>
                <code>{session.example}</code>
              </pre>
              <p>{session.result}</p>
            </div>
          </section>
          <TeacherPlan session={session} feature={lesson.feature} />
        </>
      ) : (
        <section
          className="classroom-card classroom-trainer"
          aria-label="Тренажёр"
        >
          <div className="classroom-task-nav" aria-label="Задачи тренажёра">
            {lesson.exercises.map((item, index) => (
              <button
                key={item.slot}
                aria-pressed={exerciseIndex === index}
                onClick={() => setExerciseIndex(index)}
              >
                <span>
                  {index + 1}. {index === 0 ? "Вместе" : "Самостоятельно"}
                </span>
                {progress.exercises[`${lesson.id}-${item.slot}`] && (
                  <Check size={15} aria-label="Решено" />
                )}
              </button>
            ))}
          </div>
          <PracticeExercise
            key={exercise.slot}
            exercise={exercise}
            lessonId={lesson.id}
            index={exerciseIndex}
          />
        </section>
      )}

      <div className="classroom-next">
        <span>
          {phase === "lecture"
            ? "Дальше решим две задачи по теме"
            : lesson.feature}
        </span>
        {phase === "trainer" && exerciseIndex === 1 ? (
          <Link className="classroom-cta" to={workspace}>
            К практике NOVA <ArrowRight size={17} />
          </Link>
        ) : (
          <button className="classroom-cta" onClick={nextStep}>
            {phase === "lecture" ? "К тренажёру" : "Ко второй задаче"}{" "}
            <ArrowRight size={17} />
          </button>
        )}
      </div>
      {lesson.id < lessons.length && (
        <Link className="classroom-skip" to={`/lesson/${lesson.id + 1}`}>
          Следующая пара <ArrowRight size={14} />
        </Link>
      )}
    </main>
  );
}

function TeacherPlan({
  session,
  feature,
}: {
  session: (typeof sessions)[number];
  feature: string;
}) {
  const plan = [
    [
      "0–5",
      "Начало",
      `Покажите результат, к которому идёт группа: ${feature.toLowerCase()}.`,
    ],
    [
      "5–17",
      "Объяснение",
      `По 4 минуты на каждый пункт конспекта. ${session.discuss}`,
    ],
    ["17–30", "Живой пример", session.demo],
    [
      "30–55",
      "Тренажёр",
      `12 минут вместе, 10 минут на вторую задачу и 3 минуты на разбор. ${session.together}`,
    ],
    [
      "55–78",
      "NOVA вместе",
      `5 минут на условие, 18 минут на первый рабочий вариант. ${session.practice[0]} ${session.practice[1]}`,
    ],
    [
      "78–90",
      "NOVA самостоятельно",
      `9 минут на завершение и 3 минуты на показ результата. ${session.practice[2]} ${session.verify}`,
    ],
  ];
  return (
    <details className="classroom-teacher">
      <summary>
        <Presentation size={18} /> План для преподавателя{" "}
        <span>{pairMinutes} мин</span>
      </summary>
      <ol>
        {plan.map(([time, label, instruction]) => (
          <li key={time}>
            <span>{time} мин</span>
            <div>
              <strong>{label}</strong>
              <p>{instruction}</p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}
