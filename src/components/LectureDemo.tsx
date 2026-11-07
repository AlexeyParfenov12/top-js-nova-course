import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Lesson } from "../content/types";
import { lessonStories } from "../content/lessonStories";
import { novaCSS, referenceCodes } from "../projects/nova";
import { Preview } from "./Preview";

const compactCSS = `
  footer, .cookie-banner { display: none !important; }
  main { min-height: 0; padding: 22px 6%; }
  main .hero, main .about-layout { grid-template-columns: 1fr; gap: 12px; }
  .hero-copy { padding: 0; }
  .hero .art, .about-layout .art, .festival-wordmark, .ticket ul,
  .ticket-kicker, .track-art, .track-index, .contact-details { display: none; }
  .hero h1, .about-layout h1 { font-size: clamp(24px, 5vw, 36px); margin: 0 0 12px; }
  .hero-description { margin: 0 0 14px; font-size: 14px; max-width: 53ch; }
  .hero .actions { margin: 0; gap: 8px; }
  .hero .actions > *, .hero .actions #hello { min-height: 42px; font-size: 15px; }
  .hero .actions #hello { padding: 9px 16px; background: var(--purple); color: #fff; }
  .hero #greeting { margin: 11px 0 0; font-size: 16px; font-weight: 650; }
  .ticket-grid, .grid { grid-template-columns: repeat(auto-fit, minmax(112px, 1fr)); gap: 8px; }
  .ticket, .track { padding: 12px; min-height: 0; }
  .ticket h3, .track strong { font-size: 16px; margin: 0 0 4px; }
  .ticket strong { font-size: 22px; margin: 0 0 8px; }
  .ticket button { min-height: 34px; }
  .track small { display: none; }
  .track-choice, .calculator, .base { margin: 12px 0 0; }
  .base { font-size: 21px; }
  .filters { margin-top: 0; }
  .speaker-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
  .speaker-card { min-height: 82px; padding: 12px 14px; }
  .speaker-card h2 { font-size: 17px; margin: 0 0 6px; }
  .speaker-card p { font-size: 13px; margin: 0; }
  .speaker-card:before, .speaker-card:after { display: none; }
  .about-layout .label, .about-layout > div > p:nth-of-type(2) { display: none; }
  #about-details p { font-size: 14px; }
  .contacts { display: block; }
  .contacts form { padding: 14px; }
  .contacts form h2, .contacts form > p { display: none; }
  .contacts form textarea { min-height: 52px; }
`;

const menuCSS = `
  header { padding: 10px 6%; }
  header > .btn { display: none; }
  #menu-toggle { display: inline-flex; margin-left: auto; }
  #site-nav { display: none; position: absolute; top: 100%; left: 6%; right: 6%;
    padding: 12px; background: #fbf8ff; border: 1px solid var(--line);
    border-radius: 9px; flex-wrap: wrap; justify-content: center; gap: 5px 15px; }
  #site-nav.open { display: flex; }
`;

export function LectureDemo({ lesson }: { lesson: Lesson }) {
  const { id } = lesson;
  const [finished, setFinished] = useState(false);
  const [run, setRun] = useState(0);
  const { focus } = lessonStories[id];
  const codes = useMemo(
    () => Object.fromEntries(
      Object.entries(referenceCodes).filter(([stage]) =>
        Number(stage) < id || (finished && Number(stage) === id),
      ),
    ),
    [id, finished],
  );
  const files = useMemo(() => ({
    "styles.css": novaCSS + compactCSS +
      `main > :not(${focus}) { display: none !important; }` +
      (id === 3 ? menuCSS : "header { display: none; }") +
      (id === 1 || id === 4
        ? `.hero .actions > :not(${id === 1 ? "#hello" : "#open-modal"}) { display: none; }`
        : ""),
  }), [focus, id]);

  return (
    <div className="lecture-demo" data-lesson={id}>
      <div className="lecture-demo-bar">
        <span>Фрагмент NOVA</span>
        <div role="group" aria-label="Состояние демонстрации">
          <button type="button" aria-pressed={!finished} onClick={() => setFinished(false)}>
            До кода
          </button>
          <button type="button" aria-pressed={finished} onClick={() => setFinished(true)}>
            С новым кодом
          </button>
          <button type="button" className="demo-reset" aria-label="Сбросить демонстрацию" onClick={() => setRun((n) => n + 1)}>
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="lecture-demo-frame">
        <Preview key={run} page={lesson.page} codes={codes} files={files} title="Демонстрация NOVA" />
      </div>
    </div>
  );
}
