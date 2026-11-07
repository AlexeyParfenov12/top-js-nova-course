import { BookOpen } from "lucide-react";
import { Fragment, lazy, Suspense, useState, type ReactNode } from "react";
import type { Lecture } from "../content/lectures";
import type { Lesson } from "../content/types";
import { assignmentPrimer } from "../content/assignmentPrimer";
import {
  assignmentWalkthroughs,
  type LineNote,
} from "../content/assignmentWalkthroughs";
import { assignmentGuides, lectureExamples } from "../content/lectureExamples";
import { conceptGuides, type ConceptGuide } from "../content/conceptGuides";
import { lectureTimes, sessions } from "../content/sessions";
import { lessonStories } from "../content/lessonStories";
import { LectureDemo } from "./LectureDemo";
import { LectureFigure } from "./LectureFigure";
import { SyntaxCode } from "./SyntaxCode";

const DiskLectures = lazy(() => import("./DiskLectures"));

const conceptTimes = {
  3: ["5–10", "10–15", "15–21"],
  4: ["5–9", "9–13", "13–17", "17–21"],
};

export function CourseLecture({
  lecture,
  lesson,
}: {
  lecture: Lecture;
  lesson: Lesson;
}) {
  const examples = lectureExamples[lesson.id];
  const guide = assignmentGuides[lesson.id];
  const walkthrough = assignmentWalkthroughs[lesson.id];
  const conceptNotes = conceptGuides[lesson.id];
  const story = lessonStories[lesson.id];
  const session = sessions[lesson.id];
  const [showMaterials, setShowMaterials] = useState(false);
  const times = conceptTimes[lecture.concepts.length === 4 ? 4 : 3];
  const chapters = [
    { id: "lecture-start", title: "Демонстрация" },
    ...lecture.concepts.map((concept, index) => ({
      id: `lecture-concept-${index + 1}`,
      title: concept.title,
    })),
    { id: "lecture-example", title: "Разбор заданий" },
    { id: "lecture-end", title: "Ошибки и итог" },
    { id: "lecture-materials", title: "Материалы с Диска" },
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
        <section className="lecture-opening">
          <Chapter number={1} id="lecture-start" time={lectureTimes.demo}>
            {story.question}
          </Chapter>
          <p className="lecture-demo-action">
            <strong>Что попробовать</strong>
            {story.action}
          </p>
          <LectureDemo lesson={lesson} />
          <details className="lecture-more demo-observation">
            <summary>Что должно произойти</summary>
            <p>{story.observe}</p>
            <p><strong>К концу лекции</strong> {lecture.outcome}</p>
          </details>
        </section>
        {lecture.concepts.map((concept, index) => (
          <section key={concept.title}>
            <Chapter
              number={index + 2}
              id={`lecture-concept-${index + 1}`}
              time={times[index]}
            >
              {concept.title}
            </Chapter>
            <p className="lecture-step-lead">{story.steps[index]}</p>
            <LectureFigure code={concept.code} example={examples[index]} />
            <ConceptQuestion guide={conceptNotes[index]} />
            <details className="lecture-more">
              <summary>Разбор кода</summary>
              <ol>
                {conceptNotes[index].steps.map((step) => (
                  <li key={step}><InlineCode text={step} /></li>
                ))}
              </ol>
              {concept.paragraphs.map((text) => <p key={text}><InlineCode text={text} /></p>)}
            </details>
          </section>
        ))}
        <section>
          <Chapter number={chapters.length - 2} id="lecture-example" time={lectureTimes.handoff}>
            Разбор заданий
          </Chapter>
          <div className="lecture-handoff">
            <div>
              <h3>Тренажёр</h3>
              <ol>
                {lesson.exercises.map((exercise) => (
                  <li key={exercise.slot}>{exercise.title}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3>Практика NOVA</h3>
              <p>{guide.practice}</p>
            </div>
          </div>
          <h3>Что понадобится в заданиях</h3>
          <ol>
            {assignmentPrimer[lesson.id].map((step) => (
              <li key={step}><InlineCode text={step} /></li>
            ))}
          </ol>
          <details className="concept-question">
            <summary>
              <strong>Предскажи и проверь</strong>
              <span>{session.compare[0]}</span>
            </summary>
            <p>{session.compare[1]}</p>
          </details>
          <details className="lecture-more">
            <summary>Заготовки и эталоны</summary>
            <h3>Две задачи тренажёра</h3>
            <div className="lecture-assignment-list">
              {lesson.exercises.map((exercise, index) => (
                <div className="lecture-assignment" key={exercise.slot}>
                  <h4>{index + 1}. {exercise.title}</h4>
                  <div className="lecture-assignment-content">
                    <pre aria-label={`Заготовка задачи ${index + 1}`}>
                      <SyntaxCode code={exercise.starter} />
                    </pre>
                    <p>{guide.trainer[index]}</p>
                  </div>
                  <AssignmentLineNotes notes={walkthrough.trainer[index]} />
                  <SolutionPreview code={exercise.solution} label={`Эталон задачи ${index + 1}`} />
                </div>
              ))}
            </div>
            <h3>Практика NOVA</h3>
            <LectureFigure
              code={lesson.starter.trimEnd()}
              example={{
                panels: [{ title: "Ожидаемый результат", lines: guide.sample }],
                caption: guide.result,
              }}
            />
            <AssignmentLineNotes notes={walkthrough.practice} />
            <SolutionPreview code={lesson.solution} label="Эталон практики NOVA" />
          </details>
        </section>
        <section>
          <Chapter number={chapters.length - 1} id="lecture-end" time={lectureTimes.recap}>
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
        <section className="lecture-source-materials">
          <h2 id="lecture-materials" tabIndex={-1}>Материалы с Яндекс Диска</h2>
          <p>Оригинальные лекции, иллюстрации, задания и файлы. Можно открыть нужный пример на занятии или продолжить работу после пары.</p>
          <details className="lecture-more" onToggle={(event) => {
            if (event.currentTarget.open) setShowMaterials(true);
          }}>
            <summary>Открыть материалы этой пары</summary>
            {showMaterials && (
              <Suspense fallback={<p role="status">Загружаем материалы…</p>}>
                <DiskLectures lessonId={lesson.id} />
              </Suspense>
            )}
          </details>
        </section>
      </article>
    </div>
  );
}

function InlineCode({ text }: { text: string }) {
  return text.split("`").map((part, index) =>
    index % 2 ? (
      <code key={index}>{part}</code>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function SolutionPreview({ code, label }: { code: string; label: string }) {
  return (
    <details className="lecture-solution">
      <summary>{label}</summary>
      <pre aria-label={label}>
        <SyntaxCode code={code} />
      </pre>
    </details>
  );
}

function ConceptQuestion({ guide }: { guide: ConceptGuide }) {
  return (
    <details className="concept-question">
      <summary>
        <strong>Вопрос для обсуждения</strong>
        <span>{guide.question}</span>
      </summary>
      <p>{guide.answer}</p>
    </details>
  );
}

function AssignmentLineNotes({ notes }: { notes: LineNote[] }) {
  return (
    <details className="assignment-line-notes">
      <summary>Построчный разбор</summary>
      <ol aria-label="Пояснения к строкам">
        {notes.map((note, index) =>
          note ? (
            <li key={index} value={index + 1}>
              {typeof note === "string" ? (
                <p>{note}</p>
              ) : (
                <ul>
                  {note.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              )}
            </li>
          ) : null,
        )}
      </ol>
    </details>
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
