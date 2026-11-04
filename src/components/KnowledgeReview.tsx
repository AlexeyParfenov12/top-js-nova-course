import { Check, CheckCircle2, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import type { FullLesson, KnowledgeQuestion } from "../content/types";
import { useProgress } from "../engine/persistence";
export function KnowledgeReview({ lesson }: { lesson: FullLesson }) {
  const { progress, update } = useProgress();
  return (
    <div className="knowledge-review">
      <div className="learning-section-head">
        <span className="section-icon">
          <ClipboardCheck size={22} />
        </span>
        <div>
          <p className="eyebrow">ПРОВЕРКА ПОНИМАНИЯ / 5 МИНУТ</p>
          <h2>Объясни, как это работает.</h2>
          <p>
            Ответь на вопросы, затем проверь результат проекта. Ошибка — повод
            вернуться к нужному разделу.
          </p>
        </div>
      </div>
      <div className="question-list">
        {lesson.quiz.map((q, i) => (
          <Question
            key={`${lesson.id}-${i}`}
            question={q}
            lessonId={lesson.id}
            index={i}
          />
        ))}
      </div>
      <section className="review-card">
        <p className="eyebrow">САМОПРОВЕРКА ПРОЕКТА</p>
        <h3>Пройди сценарии руками</h3>
        <ul>
          {lesson.guide.selfCheck.map((item) => (
            <li key={item}>
              <CheckCircle2 size={16} />
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="review-card reflection">
        <p className="eyebrow">ИТОГ СВОИМИ СЛОВАМИ</p>
        <h3>Что теперь умеешь?</h3>
        <p>
          Отметь пункт, когда можешь объяснить его без подсказки. Это
          самооценка, а не автоматический тест.
        </p>
        {lesson.guide.reflection.map((item, i) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={!!progress.sections[`${lesson.id}-${20 + i}`]}
              onChange={(e) =>
                update((p) => ({
                  ...p,
                  sections: {
                    ...p.sections,
                    [`${lesson.id}-${20 + i}`]: e.target.checked,
                  },
                }))
              }
            />
            <span>{item}</span>
          </label>
        ))}
      </section>
      <section className="review-card extension">
        <p className="eyebrow">ЕСЛИ СПРАВИЛСЯ БЫСТРЕЕ</p>
        <h3>Самостоятельный эксперимент</h3>
        <p>{lesson.guide.extension}</p>
        <small>
          Дополнительная практика с самопроверкой. Основные тесты NOVA проверяют
          исходные требования задания.
        </small>
      </section>
    </div>
  );
}
function Question({
  question,
  lessonId,
  index,
}: {
  question: KnowledgeQuestion;
  lessonId: number;
  index: number;
}) {
  const { progress, update } = useProgress();
  const key = `${lessonId}-${10 + index}`;
  const passed = !!progress.exercises[key];
  const [choice, setChoice] = useState<number | null>(
    passed ? question.answer : null,
  );
  const [submitted, setSubmitted] = useState(passed);
  return (
    <article
      className={
        "knowledge-question " +
        (submitted ? (passed ? "answered" : "incorrect") : "")
      }
    >
      <div className="spread">
        <span className="eyebrow">ВОПРОС {index + 1} / 4</span>
        {passed && (
          <span className="success">
            <Check size={14} />
            Верно
          </span>
        )}
      </div>
      <h3>{question.prompt}</h3>
      <fieldset>
        <legend className="sr-only">
          Варианты ответа на вопрос {index + 1}
        </legend>
        {question.options.map((option, i) => (
          <label className={choice === i ? "chosen" : ""} key={option}>
            <input
              type="radio"
              name={`quiz-${key}`}
              checked={choice === i}
              onChange={() => {
                setChoice(i);
                setSubmitted(false);
                update((p) => ({
                  ...p,
                  exercises: { ...p.exercises, [key]: false },
                }));
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <button
        className="primary"
        disabled={choice === null}
        onClick={() => {
          setSubmitted(true);
          update((p) => ({
            ...p,
            exercises: { ...p.exercises, [key]: choice === question.answer },
          }));
        }}
      >
        Проверить ответ
      </button>
      {submitted && (
        <div
          className={"answer-explanation " + (passed ? "correct" : "wrong")}
          role="status"
        >
          <strong>{passed ? "Верно." : "Пока неверно."}</strong>{" "}
          {question.explanation}
        </div>
      )}
    </article>
  );
}
