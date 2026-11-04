import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { lessons } from "../content/course";
import { useProgress } from "../engine/persistence";
export function Brand() {
  return (
    <Link className="brand" to="/">
      <b>IT</b> top<span>ACADEMY</span>
    </Link>
  );
}
export function Poster() {
  return (
    <div className="nova-poster">
      <div className="orb" />
      <div className="poster-top">
        NOVA / TECH FESTIVAL <span>12—14 / 04</span>
      </div>
      <strong>NOVA</strong>
      <p>ТЕХНОЛОГИИ / ЛЮДИ / ИДЕИ</p>
      <div className="poster-bottom">
        Твой первый большой проект <ArrowUpRight size={22} />
      </div>
    </div>
  );
}
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  return (
    <div className="progress-wrap">
      {label && (
        <div className="spread">
          <span>{label}</span>
          <strong>{value}%</strong>
        </div>
      )}
      <div
        className="progress-bar"
        role="progressbar"
        aria-label={label || "Прогресс"}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: value + "%" }} />
      </div>
    </div>
  );
}
export function LessonRow({ id }: { id: number }) {
  const { progress } = useProgress();
  const l = lessons[id - 1];
  const done = progress.applied.includes(id);
  return (
    <Link className={"lesson-row " + (done ? "done" : "")} to={`/lesson/${id}`}>
      <span className="lesson-number">
        {done ? <Check size={17} /> : String(id).padStart(2, "0")}
      </span>
      <div>
        <strong>{l.title}</strong>
        <small>{l.feature}</small>
      </div>
      <span className="duration">90 мин</span>
      <ChevronRight size={17} />
    </Link>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {title}
        <span className="corner" />
      </h1>
      {description && <p className="lead">{description}</p>}
    </div>
  );
}
