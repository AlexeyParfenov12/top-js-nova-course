import { days, lessons } from "../content/course";
import { pairMinutes } from "../content/sessions";
import { LessonRow, PageHeading } from "../components/common";

export function Curriculum() {
  return (
    <main className="standard-page">
      <PageHeading
        eyebrow={`3 ДНЯ · 9 ПАР · ${pairMinutes} МИНУТ НА ПАРУ`}
        title="Программа курса"
        description="В каждой паре один маршрут: лекция, тренажёр и практика на NOVA."
      />
      <div className="curriculum-list">
        {days.map((day, index) => (
          <section className="curriculum-day" key={day}>
            <div className="curriculum-head">
              <div>
                <p className="eyebrow">ДЕНЬ {index + 1} · 3 ПАРЫ</p>
                <h2>{day}</h2>
              </div>
            </div>
            {lessons
              .filter((lesson) => lesson.day === index + 1)
              .map((lesson) => (
                <LessonRow id={lesson.id} key={lesson.id} />
              ))}
          </section>
        ))}
      </div>
    </main>
  );
}
