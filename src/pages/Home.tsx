import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  Layers,
  ListChecks,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { days, lessons, courseTotals } from "../content/course";
import { sessionAgenda } from "../content/depth";
import { useProgress } from "../engine/persistence";
import { lessonStats } from "../engine/learning";
import { projectReady } from "../projects/nova";
import { LessonRow, ProgressBar } from "../components/common";
export function Home() {
  const { progress } = useProgress();
  const current = lessons[progress.current - 1];
  const currentStats = lessonStats(current, progress);
  const totals = lessons.map((l) => lessonStats(l, progress));
  const done = totals.reduce((n, s) => n + s.done, 0);
  const all = totals.reduce((n, s) => n + s.total, 0);
  return (
    <main className="home academy-home">
      <div className="dashboard-breadcrumb">
        <span>ОБРАЗОВАТЕЛЬНАЯ ПЛАТФОРМА TOP</span>
        <span>
          <span className="online-dot" />
          Обучение без регистрации
        </span>
      </div>
      <section className="course-welcome">
        <div className="course-welcome-copy">
          <div className="course-level">
            <b>JS</b>
            <span>ПРАКТИЧЕСКИЙ КУРС / С НУЛЯ</span>
          </div>
          <h1>
            JavaScript:
            <br />
            оживи сайт <em>NOVA</em>
          </h1>
          <p className="lead">
            Разберись в основах, потренируйся на небольших задачах и собери
            интерактивный сайт фестиваля. Один понятный шаг за другим.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={`/lesson/${progress.current}`}>
              <Play size={16} />
              {progress.applied.length || Object.keys(progress.drafts).length
                ? "Продолжить обучение"
                : "Начать обучение"}
            </Link>
            <Link className="text-link" to="/curriculum">
              Посмотреть программу
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="welcome-facts">
            <span>
              <Layers size={15} />3 учебных дня
            </span>
            <span>
              <Clock3 size={15} />9 пар × 90 минут
            </span>
            <span>
              <Code2 size={15} />
              Практика в браузере
            </span>
          </div>
        </div>
        <aside className="next-lesson-card">
          <div className="spread">
            <span className="eyebrow">ТВОЙ СЛЕДУЮЩИЙ ШАГ</span>
            <span className="lesson-badge">
              {String(current.id).padStart(2, "0")} / 09
            </span>
          </div>
          <p className="next-lesson-day">
            День {current.day} · {days[current.day - 1]}
          </p>
          <h2>{current.title}</h2>
          <p>{current.goal}</p>
          <ProgressBar value={currentStats.percent} />
          <div className="next-lesson-meta">
            <span>
              {currentStats.done}/{currentStats.total} шагов
            </span>
            <span>90 минут</span>
          </div>
          <Link className="button" to={`/lesson/${current.id}`}>
            Открыть занятие
            <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
      <div className="course-numbers">
        <div>
          <BookOpen size={19} />
          <strong>{courseTotals.sections}</strong>
          <span>раздела теории</span>
        </div>
        <div>
          <Code2 size={19} />
          <strong>{courseTotals.exercises}</strong>
          <span>задачи с кодом</span>
        </div>
        <div>
          <ListChecks size={19} />
          <strong>{courseTotals.questions}</strong>
          <span>контрольных вопросов</span>
        </div>
        <div>
          <CheckCircle2 size={19} />
          <strong>1</strong>
          <span>полноценный проект</span>
        </div>
      </div>
      <section className="learning-status">
        <div>
          <span className="eyebrow">УЧЕБНЫЙ МАРШРУТ</span>
          <p>
            <b>{done}</b> из {all} шагов пройдено
          </p>
        </div>
        <ProgressBar value={Math.round((done / all) * 100)} />
        <Link className="text-link" to="/project">
          NOVA готов на {projectReady(progress)}%<ArrowRight size={14} />
        </Link>
      </section>
      <section className="course-route-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ОТ ПЕРВОЙ СТРОКИ К ГОТОВОМУ САЙТУ</p>
            <h2>Твой маршрут на три дня</h2>
          </div>
          <Link className="text-link" to="/curriculum">
            Вся программа
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="day-columns">
          {days.map((day, i) => (
            <article className="day-card" key={day}>
              <div className="day-card-head">
                <span className="day-label">
                  ДЕНЬ {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  {
                    progress.applied.filter((n) => lessons[n - 1].day === i + 1)
                      .length
                  }
                  /3 этапов
                </span>
              </div>
              <h3>{day}</h3>
              <p className="day-card-description">
                {
                  [
                    "Текст, вычисления и первые состояния интерфейса.",
                    "События, карточки из данных и фильтры программы.",
                    "Калькулятор, форма, отладка и независимый сайт.",
                  ][i]
                }
              </p>
              {lessons
                .filter((l) => l.day === i + 1)
                .map((l) => (
                  <LessonRow id={l.id} key={l.id} />
                ))}
            </article>
          ))}
        </div>
      </section>
      <section className="session-overview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">УЧИМСЯ ЧЕРЕЗ ДЕЙСТВИЕ</p>
            <h2>Как устроены 90 минут</h2>
          </div>
        </div>
        <div className="session-timeline">
          {sessionAgenda.map((phase, i) => (
            <div key={phase.title}>
              <span className="phase-number">0{i + 1}</span>
              <strong>{phase.title}</strong>
              <p>{phase.description}</p>
              <span className="phase-time">{phase.minutes} мин</span>
            </div>
          ))}
        </div>
        <p className="pace-note">
          План рассчитан на чтение, эксперименты и самостоятельную работу.
          Фактический темп индивидуален; дополнительных ожиданий и блокирующего
          таймера нет.
        </p>
      </section>
      <section className="project-teaser new-project-teaser">
        <div className="project-symbol">
          <Code2 size={35} />
        </div>
        <div>
          <p className="eyebrow">РЕЗУЛЬТАТ, КОТОРЫЙ МОЖНО ПОКАЗАТЬ</p>
          <h2>Семь страниц. Твой JavaScript.</h2>
          <p>
            NOVA растёт вместе с твоими навыками: от первой кнопки до программы
            фестиваля, билетов и формы.
          </p>
        </div>
        <div className="teaser-actions">
          <Link className="button primary" to="/project">
            Мой проект
            <ArrowRight size={15} />
          </Link>
          <a
            className="text-link"
            href={import.meta.env.BASE_URL + "nova/index.html"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Готовый образец
            <ExternalLink size={13} />
          </a>
        </div>
      </section>
    </main>
  );
}
