import {
  ArrowRight,
  BookOpen,
  Code2,
  Layers,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { days, lessons } from "../content/course";
import { useProgress } from "../engine/persistence";
import { projectReady } from "../projects/nova";
import { LessonRow, Poster, ProgressBar } from "../components/common";
export function Home() {
  const { progress } = useProgress();
  return (
    <main className="home">
      <p className="eyebrow">МОИ КУРСЫ / JAVASCRIPT: ОЖИВИ САЙТ NOVA</p>
      <div className="hero">
        <div>
          <span className="pill">Для начинающих · учимся на практике</span>
          <h1>
            JavaScript:
            <br />
            оживи сайт <em>NOVA</em>
            <span className="corner" />
          </h1>
          <p className="lead">
            От первой строки кода до собственного интерактивного сайта. Изучай,
            экспериментируй и сразу смотри результат.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={`/lesson/${progress.current}`}>
              <Play size={17} />
              {progress.applied.length || Object.keys(progress.drafts).length
                ? "Продолжить обучение"
                : "Начать обучение"}
            </Link>
            <Link className="text-link" to="/project?reference=1">
              Посмотреть результат <ArrowRight size={16} />
            </Link>
          </div>
          <div className="course-facts">
            <span>
              <b className="js-badge">JS</b> JavaScript
            </span>
            <span>
              <Layers size={18} /> 3 дня
            </span>
            <span>
              <BookOpen size={18} /> 9 × 90 минут
            </span>
          </div>
        </div>
        <Poster />
      </div>
      <div className="continue-strip">
        <div>
          <span className="eyebrow">ТВОЙ ПРОГРЕСС</span>
          <p>{progress.applied.length} из 9 этапов добавлено в NOVA</p>
        </div>
        <ProgressBar value={projectReady(progress)} />
        <Link to="/project" className="text-link">
          Мой проект <ArrowUpRightIcon />
        </Link>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">ПРОГРАММА КУРСА</p>
            <h2>Три дня. Один работающий сайт.</h2>
          </div>
          <span className="muted">13,5 часов практики и открытий</span>
        </div>
        <div className="day-columns">
          {days.map((d, i) => (
            <article className="day-card" key={d}>
              <div className="day-card-head">
                <span className="day-label">ДЕНЬ 0{i + 1}</span>
                <span>
                  {
                    progress.applied.filter((n) => lessons[n - 1].day === i + 1)
                      .length
                  }
                  /3
                </span>
              </div>
              <h3>{d}</h3>
              {lessons
                .filter((l) => l.day === i + 1)
                .map((l) => (
                  <LessonRow id={l.id} key={l.id} />
                ))}
            </article>
          ))}
        </div>
      </section>
      <section className="project-teaser">
        <div className="project-symbol">
          <Code2 size={40} />
        </div>
        <div>
          <p className="eyebrow">ТВОЙ БОЛЬШОЙ ПРОЕКТ</p>
          <h2>NOVA — фестиваль, который оживишь ты</h2>
          <p>
            7 готовых страниц. 9 последовательных этапов. Твой JavaScript — от
            первой кнопки до фильтров, билетов и формы.
          </p>
        </div>
        <Link className="button" to="/project">
          К проекту <ArrowRight size={17} />
        </Link>
      </section>
      <div className="quiet-note">
        <Sparkles size={16} /> Без регистрации. Код и прогресс сохраняются в
        этом браузере.
      </div>
    </main>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={16} style={{ transform: "rotate(-45deg)" }} />;
}
