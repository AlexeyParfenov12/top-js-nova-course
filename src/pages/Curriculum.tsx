import { days, lessons, courseTotals } from "../content/course";
import { LessonRow, PageHeading, ProgressBar } from "../components/common";
import { useProgress } from "../engine/persistence";
export function Curriculum() {
  const { progress } = useProgress();
  return (
    <main className="standard-page">
      <PageHeading
        eyebrow="КУРС / УЧЕБНЫЙ МАРШРУТ"
        title="Программа курса"
        description="Каждое занятие: теория → тренажёр → практика в NOVA → проверка → твой проект."
      />
      <div className="curriculum-facts">
        <span>
          <b>{courseTotals.sections}</b> раздела теории
        </span>
        <span>
          <b>{courseTotals.exercises}</b> задачи с кодом
        </span>
        <span>
          <b>{courseTotals.questions}</b> контрольных вопросов
        </span>
        <span>
          <b>9</b> этапов NOVA
        </span>
      </div>
      <div className="curriculum-list">
        {days.map((day, i) => (
          <section className="curriculum-day" key={day}>
            <div className="curriculum-head">
              <span className="day-index">0{i + 1}</span>
              <div>
                <p className="eyebrow">ДЕНЬ {i + 1} · 270 МИНУТ</p>
                <h2>{day}</h2>
              </div>
              <div className="day-progress">
                <ProgressBar
                  value={Math.round(
                    (progress.applied.filter(
                      (n) => lessons[n - 1].day === i + 1,
                    ).length /
                      3) *
                      100,
                  )}
                  label="Этапы дня"
                />
              </div>
            </div>
            {lessons
              .filter((l) => l.day === i + 1)
              .map((l) => (
                <LessonRow id={l.id} key={l.id} />
              ))}
          </section>
        ))}
      </div>
      <p className="notice">
        Все материалы доступны сразу. Этапы добавляются в проект
        последовательно, чтобы новые функции опирались на уже работающие.
      </p>
    </main>
  );
}
