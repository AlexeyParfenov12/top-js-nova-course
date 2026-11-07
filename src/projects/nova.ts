import indexPage from "./nova-pages/index.html?raw";
import aboutPage from "./nova-pages/about.html?raw";
import tracksPage from "./nova-pages/tracks.html?raw";
import programPage from "./nova-pages/program.html?raw";
import speakersPage from "./nova-pages/speakers.html?raw";
import ticketsPage from "./nova-pages/tickets.html?raw";
import contactsPage from "./nova-pages/contacts.html?raw";
import footer from "./nova-pages/footer.html?raw";
import themeCSS from "./nova.css?raw";
import orbitImage from "./assets/nova-orbit-data.txt?raw";
import type { NovaPage, Progress } from "../content/types";
import { lessons } from "../content/course";
export const pages: { id: NovaPage; name: string }[] = [
  { id: "index", name: "Главная" },
  { id: "about", name: "О фестивале" },
  { id: "tracks", name: "Направления" },
  { id: "program", name: "Программа" },
  { id: "speakers", name: "Спикеры" },
  { id: "tickets", name: "Билеты" },
  { id: "contacts", name: "Контакты" },
];
export const novaCSS = themeCSS;
const pageContent: Record<NovaPage, string> = {
  index: indexPage,
  about: aboutPage,
  tracks: tracksPage,
  program: programPage,
  speakers: speakersPage,
  tickets: ticketsPage,
  contacts: contactsPage,
};

export const novaData = `window.novaSpeakers = [{name:'Анна Вега',role:'AI-исследователь'},{name:'Марк Лин',role:'Frontend-инженер'},{name:'Алексей Мир',role:'Разработчик игр'}];
window.novaEvents = [{day:1,track:'AI',time:'10:00 — 11:00',title:'Будущее искусственного интеллекта'},{day:1,track:'Web',time:'11:30 — 12:30',title:'Как браузер оживляет интерфейс'},{day:1,track:'GameDev',time:'13:00 — 14:00',title:'Мир, который создаёшь ты'},{day:2,track:'Web',time:'10:00 — 11:00',title:'Интерфейсы, которые понимают людей'},{day:2,track:'Robotics',time:'12:00 — 13:00',title:'Первый робот: от кода к движению'},{day:3,track:'AI',time:'10:00 — 11:00',title:'Данные и решения'},{day:3,track:'GameDev',time:'13:00 — 14:00',title:'Создаём игровой прототип'}];`;
function indent(markup: string, width: number) {
  const prefix = " ".repeat(width);
  return markup
    .trim()
    .split("\n")
    .map((line) => (line ? prefix + line : ""))
    .join("\n");
}

function pageBody(page: NovaPage) {
  const links = pages
    .filter((item) => item.id !== "index")
    .map((item) => {
      const current = item.id === page ? ' aria-current="page"' : "";
      return `        <a href="${item.id}.html"${current}>${item.name}</a>`;
    })
    .join("\n");

  return `    <header>
      <a href="index.html" class="logo" aria-label="NOVA — главная">
        <b>TOP</b><span><strong>NOVA</strong>TECH FESTIVAL</span>
      </a>
      <nav id="site-nav" aria-label="Навигация фестиваля">
${links}
      </nav>
      <a class="btn purple" href="tickets.html">Билеты ↗</a>
      <button
        id="menu-toggle"
        aria-expanded="false"
        aria-controls="site-nav"
        aria-label="Открыть меню"
      >☰</button>
    </header>

    <main>
${indent(pageContent[page], 6)}
    </main>

${indent(footer, 4)}`;
}

function htmlFile(page: NovaPage, name: string) {
  const scripts = lessons
    .map(
      (lesson) =>
        `    <script src="scripts/stage-${lesson.id}.js" defer></script>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>NOVA — ${name}</title>
    <link rel="stylesheet" href="styles.css">
    <script src="data.js" defer></script>
${scripts}
  </head>

  <body>
${pageBody(page)}
  </body>
</html>
`;
}

const pageFiles = Object.fromEntries(
  pages.map(({ id, name }) => [`${id}.html`, htmlFile(id, name)]),
);

// Each generated stage adds a comment and a wrapper before the student's code.
export const stageCodeLineOffset = 2;

export function projectFiles(
  codes: Record<string, string>,
  overrides: Record<string, string> = {},
) {
  const files: Record<string, string> = {
    ...pageFiles,
    "styles.css": novaCSS,
    "data.js": novaData,
    "assets/nova-orbit.webp": orbitImage.trim(),
  };
  lessons.forEach(
    (l) =>
      (files[`scripts/stage-${l.id}.js`] =
        `// Этап ${l.id}: ${l.title}\n(() => {\n${codes[l.id] || "// Этот этап ещё не добавлен."}\n})();\n`),
  );
  return { ...files, ...overrides };
}
export const referenceCodes = Object.fromEntries(
  lessons.map((l) => [String(l.id), l.solution]),
);
export function projectReady(progress: Progress) {
  return Math.round((progress.applied.length / lessons.length) * 100);
}
