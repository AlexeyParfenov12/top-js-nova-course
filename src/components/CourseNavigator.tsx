import { useId, useRef } from "react";
import { Check, ChevronRight, ListTree, X } from "lucide-react";
import { Link } from "react-router-dom";
import { days, lessons } from "../content/course";
import { useProgress } from "../engine/persistence";
import "../styles/navigator.css";

function remaining(count: number) {
  if (count === 1) return "1 пара";
  return `${count} ${count >= 2 && count <= 4 ? "пары" : "пар"}`;
}

export function CourseNavigator({ lessonId }: { lessonId: number }) {
  const lesson = lessons[lessonId - 1];
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { progress } = useProgress();
  const leftToday = lessons.filter(
    (item) => item.day === lesson.day && item.id > lessonId,
  ).length;
  const leftInCourse = lessons.length - lessonId;

  return (
    <>
      <button
        className="course-nav-trigger"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <ListTree size={16} /> Навигатор
      </button>
      <dialog
        className="course-nav-dialog"
        ref={dialog}
        aria-labelledby={titleId}
      >
        <header className="course-nav-heading">
          <h2 id={titleId}>Навигатор курса</h2>
          <button
            aria-label="Закрыть навигатор"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </header>
        <div className="course-nav-body">
          <div className="course-nav-current">
            <span>
              СЕЙЧАС · ТЕМА {lessonId} ИЗ {lessons.length}
            </span>
            <strong>{lesson.title}</strong>
            <p>
              После этой пары — {remaining(leftToday)} сегодня и{" "}
              {remaining(leftInCourse)} до конца курса.
            </p>
          </div>
          {days.map((day, index) => (
            <section className="course-nav-day" key={day}>
              <h3>
                День {index + 1} <span>{day}</span>
              </h3>
              <ol>
                {lessons
                  .filter((item) => item.day === index + 1)
                  .map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/lesson/${item.id}`}
                        aria-current={item.id === lessonId ? "page" : undefined}
                        onClick={() => dialog.current?.close()}
                      >
                        <span className="course-nav-number">
                          {String(item.id).padStart(2, "0")}
                        </span>
                        <span>{item.title}</span>
                        {progress.applied.includes(item.id) ? (
                          <Check
                            size={16}
                            aria-label="Этап добавлен в проект"
                          />
                        ) : (
                          <ChevronRight size={16} aria-hidden="true" />
                        )}
                      </Link>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </div>
      </dialog>
    </>
  );
}
