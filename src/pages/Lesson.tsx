import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Presentation,
} from "lucide-react";
import { lessons } from "../content/course";
import { lectures } from "../content/lectures";
import { lectureTimes, pair, pairMinutes, sessions } from "../content/sessions";
import type { Lesson } from "../content/types";
import { useProgress } from "../engine/persistence";
import { CourseNavigator } from "../components/CourseNavigator";
import { CourseLecture } from "../components/CourseLecture";
import "../styles/classroom.css";

const PracticeExercise = lazy(() => import("../components/PracticeExercise"));

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
  const lecture = lectures[lesson.id];
  const workspace = `/workspace/${lesson.id}`;
  const exercise = lesson.exercises[exerciseIndex];
  const pairOfDay = ((lesson.id - 1) % 3) + 1;

  function nextStep() {
    if (phase === "lecture") setPhase("trainer");
    else setExerciseIndex(1);
    phaseNav.current?.scrollIntoView({ block: "start" });
  }

  return (
    <main className={phase === "lecture" ? "classroom classroom-lecture" : "classroom"}>
      <div className="classroom-top">
        <Link to="/curriculum">
          <ArrowLeft size={15} /> К программе
        </Link>
        <div className="classroom-top-tools">
          <span>
            <Clock3 size={15} /> {pairMinutes} минут
          </span>
          <CourseNavigator lessonId={lesson.id} />
        </div>
      </div>
      <header className="classroom-heading">
        <p>
          ДЕНЬ {lesson.day} · ПАРА {pairOfDay} ИЗ 3
        </p>
        <h1>{lesson.title}</h1>
        {phase === "trainer" && <div>{lesson.goal}</div>}
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
          <PairPlan lesson={lesson} session={session} />
          <CourseLecture lecture={lecture} lesson={lesson} />
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
          <Suspense fallback={<p role="status">Открываем тренажёр…</p>}>
            <PracticeExercise
              key={exercise.slot}
              exercise={exercise}
              lessonId={lesson.id}
              index={exerciseIndex}
            />
          </Suspense>
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

function PairPlan({
  session,
  lesson,
}: {
  lesson: Lesson;
  session: (typeof sessions)[number];
}) {
  const plan = [
    [
      lectureTimes.demo,
      "Демонстрация",
      `Сравните NOVA до и после добавления кода. Результат пары — ${lesson.feature.toLowerCase()}.`,
    ],
    [
      lectureTimes.concepts,
      "Код и результат",
      "Пройдите примеры по порядку. Прочитайте код, предскажите результат и проверьте себя по примеру справа.",
    ],
    [
      lectureTimes.handoff,
      "Разбор заданий",
      `Сверьтесь с заготовками и обсудите вопрос «Предскажи и проверь». ${session.compare[0]}`,
    ],
    [
      lectureTimes.recap,
      "Ошибки и итог",
      "Разберите две типичные ошибки и проговорите переход к тренажёру.",
    ],
    [
      "30–42",
      "Тренажёр вместе",
      `Решите «${lesson.exercises[0].title}». Запустите проверку и обсудите, почему работает каждая добавленная строка.`,
    ],
    [
      "42–52",
      "Тренажёр самостоятельно",
      `Реши «${lesson.exercises[1].title}». Сравни результат до и после запуска или на двух разных наборах данных.`,
    ],
    [
      "52–55",
      "Разбор решений",
      session.review,
    ],
    [
      "55–60",
      "Подготовка проекта",
      "Откройте «Условие задания». Найдите готовые строки и места, где нужно дописать код.",
    ],
    [
      "60–78",
      "NOVA вместе",
      `${session.practice[0]} ${session.practice[1]}`,
    ],
    [
      "78–87",
      "NOVA самостоятельно",
      session.practice[2],
    ],
    [
      "87–90",
      "Показ результата",
      session.verify,
    ],
  ];
  return (
    <details className="classroom-plan">
      <summary>
        <Presentation size={18} /> План пары <span>{pairMinutes} мин</span>
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
      <p className="classroom-plan-extra">
        <strong>Если закончили раньше.</strong> {session.extra}
      </p>
    </details>
  );
}
