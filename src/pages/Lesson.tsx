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
import { pair, pairMinutes, sessions } from "../content/sessions";
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
    <main className="classroom">
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
          <PairPlan session={session} feature={lesson.feature} />
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
  feature,
}: {
  session: (typeof sessions)[number];
  feature: string;
}) {
  const plan = [
    [
      "0–5",
      "Начало",
      `Посмотрите, что соберём к концу пары: ${feature.toLowerCase()}.`,
    ],
    [
      "5–17",
      "Объяснение",
      "Пройдите разделы 2–4 по порядку. На каждый раздел отведите 4 минуты: сначала обсудите понятие, затем прочитайте пример кода.",
    ],
    [
      "17–27",
      "Разбор заданий",
      "Посмотрите заготовки из тренажёра и практики NOVA. Разберите, что уже написано, что нужно дописать и какой результат ожидается.",
    ],
    [
      "27–30",
      "Ошибки и итог",
      "Разберите две типичные ошибки и проговорите переход к тренажёру.",
    ],
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
    </details>
  );
}
