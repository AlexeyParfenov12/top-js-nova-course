import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import type { Lecture } from "../content/lectures";
import type { Lesson } from "../content/types";
import { assignmentGuides, lectureExamples } from "../content/lectureExamples";
import { LectureFigure } from "./LectureFigure";

const conceptTimes = ["5–9", "9–13", "13–17"];

export function CourseLecture({
  lecture,
  lesson,
}: {
  lecture: Lecture;
  lesson: Lesson;
}) {
  const examples = lectureExamples[lesson.id];
  const guide = assignmentGuides[lesson.id];
  const chapters = [
    { id: "lecture-start", title: "Зачем это нужно" },
    ...lecture.concepts.map((concept, index) => ({
      id: `lecture-concept-${index + 1}`,
      title: concept.title,
    })),
    { id: "lecture-example", title: "Разбор заданий" },
    { id: "lecture-end", title: "Ошибки и итог" },
  ];

  function goToChapter(id: string) {
    const heading = document.getElementById(id);
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "start" });
  }

  return (
    <div className="lecture-layout">
      <nav className="lecture-outline" aria-label="Содержание лекции">
        <strong>
          <BookOpen size={16} /> Содержание
        </strong>
        <ol>
          {chapters.map(({ id, title }, index) => (
            <li key={id}>
              <button type="button" onClick={() => goToChapter(id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {title}
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <article className="classroom-card lecture-body" aria-label="Лекция">
        <section>
          <Chapter number={1} id="lecture-start" time="0–5">
            Зачем это нужно
          </Chapter>
          {lecture.opening.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p className="lecture-outcome">
            <strong>К концу лекции</strong> {lecture.outcome}
          </p>
        </section>
        {lecture.concepts.map((concept, index) => (
          <section key={concept.title}>
            <Chapter
              number={index + 2}
              id={`lecture-concept-${index + 1}`}
              time={conceptTimes[index]}
            >
              {concept.title}
            </Chapter>
            <p>{concept.paragraphs[0]}</p>
            <LectureFigure code={concept.code} example={examples[index]} />
            {concept.paragraphs.slice(1).map((text) => (
              <p key={text}>{text}</p>
            ))}
          </section>
        ))}
        <section>
          <Chapter number={5} id="lecture-example" time="17–27">
            Разбор заданий
          </Chapter>
          <p>
            Здесь разобраны те же заготовки, которые откроются во вкладках
            «Тренажёр» и «Практика NOVA». Сначала посмотрите, что предстоит
            дописать и какой результат нужно получить.
          </p>
          <h3>Две задачи тренажёра</h3>
          <div className="lecture-assignment-list">
            {lesson.exercises.map((exercise, index) => (
              <div className="lecture-assignment" key={exercise.slot}>
                <h4>
                  {index + 1}. {exercise.title}
                </h4>
                <pre aria-label={`Заготовка задачи ${index + 1}`}>
                  <code>{exercise.starter}</code>
                </pre>
                <p>{guide.trainer[index]}</p>
              </div>
            ))}
          </div>
          <h3>Практика NOVA</h3>
          <p>{guide.practice}</p>
          <LectureFigure
            code={lesson.starter.trimEnd()}
            example={{
              panels: [{ title: "Ожидаемый результат", lines: guide.sample }],
              caption: guide.result,
            }}
          />
        </section>
        <section>
          <Chapter number={6} id="lecture-end" time="27–30">
            Ошибки и итог
          </Chapter>
          <ul>
            {lecture.mistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
          <p>
            <strong>Дальше.</strong> {lecture.bridge}
          </p>
        </section>
      </article>
    </div>
  );
}

function Chapter({
  number,
  id,
  time,
  children,
}: {
  number: number;
  id: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div className="lecture-chapter">
      <h2 id={id} tabIndex={-1}>
        <span>{String(number).padStart(2, "0")}</span>
        {children}
      </h2>
      <span>{time} мин</span>
    </div>
  );
}
