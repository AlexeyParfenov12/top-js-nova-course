import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import type { Lecture } from "../content/lectures";

const conceptTimes = ["5–9", "9–13", "13–17"];

export function CourseLecture({ lecture }: { lecture: Lecture }) {
  const chapters = [
    { id: "lecture-start", title: "Зачем это нужно" },
    ...lecture.concepts.map((concept, index) => ({
      id: `lecture-concept-${index + 1}`,
      title: concept.title,
    })),
    { id: "lecture-example", title: "Пишем вместе" },
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
            {concept.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <pre>
              <code>{concept.code}</code>
            </pre>
          </section>
        ))}
        <section>
          <Chapter number={5} id="lecture-example" time="17–27">
            Пишем вместе
          </Chapter>
          <h3>{lecture.live.title}</h3>
          <p>{lecture.live.setup}</p>
          <h3>Как это работает</h3>
          <ol>
            {lecture.live.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <pre>
            <code>{lecture.live.code}</code>
          </pre>
          <p>
            <strong>Что увидим.</strong> {lecture.live.result}
          </p>
          <p>
            <strong>Попробуйте изменить.</strong> {lecture.live.variation}
          </p>
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
