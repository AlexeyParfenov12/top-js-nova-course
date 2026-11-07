import { ArrowRight, Clock3, Layers, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { days, lessons } from "../content/course";
import { pair, pairMinutes } from "../content/sessions";
import { useProgress } from "../engine/persistence";
import { LessonRow } from "../components/common";

export function Home() {
  const { progress } = useProgress();
  return (
    <main className="home academy-home">
      <section className="course-welcome">
        <div className="course-welcome-copy">
          <div className="course-level">
            <b>JS</b>
            <span>ПРАКТИЧЕСКИЙ КУРС</span>
          </div>
          <h1>
            JavaScript:
            <br />
            оживи сайт <em>NOVA</em>
          </h1>
          <p className="lead">
            Разбираем тему с преподавателем, решаем две задачи и сразу применяем
            новое на сайте фестиваля.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={`/lesson/${progress.current}`}>
              <Play size={16} />
              {progress.applied.length || Object.keys(progress.drafts).length
                ? "Продолжить обучение"
                : "Начать обучение"}
            </Link>
            <Link className="text-link" to="/curriculum">
              Программа курса <ArrowRight size={15} />
            </Link>
          </div>
          <div className="welcome-facts">
            <span>
              <Layers size={15} /> 3 дня · 9 пар
            </span>
            <span>
              <Clock3 size={15} /> {pairMinutes} минут на пару
            </span>
          </div>
        </div>
        <aside className="next-lesson-card course-pair-card">
          <h2>Как проходит пара</h2>
          <dl>
            <div>
              <dt>01 · Лекция</dt>
              <dd>{pair.lecture} мин</dd>
            </div>
            <div>
              <dt>02 · Тренажёр</dt>
              <dd>{pair.trainer} мин</dd>
            </div>
            <div>
              <dt>03 · Практика NOVA</dt>
              <dd>{pair.practice} мин</dd>
            </div>
          </dl>
        </aside>
      </section>
      <section className="course-route-section">
        <div className="section-heading">
          <h2>Девять пар за три дня</h2>
        </div>
        <div className="day-columns">
          {days.map((day, index) => (
            <article className="day-card" key={day}>
              <span className="day-label">ДЕНЬ {index + 1}</span>
              <h3>{day}</h3>
              {lessons
                .filter((lesson) => lesson.day === index + 1)
                .map((lesson) => (
                  <LessonRow id={lesson.id} key={lesson.id} />
                ))}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
