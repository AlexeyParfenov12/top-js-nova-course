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
const art = `<div class="art" aria-label="Объёмная хромированная скульптура NOVA"><img src="assets/nova-orbit.webp" alt="Хромированные орбиты и фиолетовое стекло — арт-объект NOVA" width="1122" height="1402"><div class="visual-caption"><span>THE FUTURE IS AROUND US</span><span>↗</span></div><div class="visual-sticker"><b>3 ДНЯ</b>НОВЫХ<br>ОТКРЫТИЙ</div><div class="date"><div><strong>12—14 / 04</strong><small>ЕКАТЕРИНБУРГ · ЭКСПО</small></div><span>ТЕХНОЛОГИИ.<br>ЛЮДИ. ИДЕИ.</span></div></div>`;
const trackGraphics = [
  `<svg viewBox="0 0 100 100" fill="none"><defs><radialGradient id="ai"><stop stop-color="#eadcff"/><stop offset=".5" stop-color="#a867f4"/><stop offset="1" stop-color="#30154e"/></radialGradient></defs><circle cx="50" cy="50" r="36" fill="url(#ai)"/><ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(-35 50 50)" stroke="#c8a3fc" stroke-width="2"/><ellipse cx="50" cy="50" rx="45" ry="15" transform="rotate(35 50 50)" stroke="#b67aef" stroke-width="1.5"/></svg>`,
  `<svg viewBox="0 0 100 100" fill="none"><path d="M28 26h44c9 0 12 8 15 19l7 27c3 14-8 18-17 8L65 68H35L23 80C14 90 3 86 6 72l7-27c3-11 6-19 15-19Z" fill="#bbb4cb" stroke="#9484a6" stroke-width="2"/><path d="M29 40v20M19 50h20" stroke="#655578" stroke-width="5" stroke-linecap="round"/><circle cx="73" cy="43" r="4" fill="#8064ad"/><circle cx="82" cy="54" r="4" fill="#8064ad"/><circle cx="44" cy="66" r="6" fill="#f5f2fa"/><circle cx="59" cy="66" r="6" fill="#f5f2fa"/></svg>`,
  `<svg viewBox="0 0 100 100" fill="none"><rect x="5" y="16" width="90" height="69" rx="10" fill="#a574f2" stroke="#d2afff" stroke-width="1.5"/><path d="M5 32h90" stroke="#d2afff"/><circle cx="16" cy="24" r="2" fill="#ead5ff"/><circle cx="24" cy="24" r="2" fill="#ead5ff"/><path d="m35 45-13 12 13 12m30-24 13 12-13 12M56 41 45 75" stroke="#f0dcff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  `<svg viewBox="0 0 100 100" fill="none"><path d="M20 86h60M34 85V70l18-15-14-25 25-15 17 17" stroke="#aaa2bf" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="54" r="10" fill="#d6cfdf" stroke="#8b7f9e" stroke-width="2"/><circle cx="38" cy="29" r="9" fill="#d6cfdf" stroke="#8b7f9e" stroke-width="2"/><path d="m74 32 10 8 7-7M73 32l-1 14 9 4" stroke="#776589" stroke-width="4" stroke-linecap="round"/></svg>`,
];
const tracks = () =>
  `<div class="grid">${[
    ["AI", "Искусственный интеллект"],
    ["GameDev", "Разработка игр"],
    ["Web", "Веб-технологии"],
    ["Robotics", "Робототехника"],
  ]
    .map(
      ([name, text], i) =>
        `<button type="button" class="track" data-track="${name}" aria-label="Выбрать ${name}"><span class="track-index">0${i + 1} / EXPLORE</span><span class="track-arrow" aria-hidden="true">↗</span><span class="track-art" aria-hidden="true">${trackGraphics[i]}</span><strong>${name}</strong><small>${text}</small></button>`,
    )
    .join("")}</div>`;
const intro = (
  number: string,
  eyebrow: string,
  title: string,
  description: string,
) =>
  `<section class="page-intro"><div><div class="label">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div><span class="page-number">NOVA / ${number}</span></section>`;
export const novaData = `window.novaSpeakers = [{name:'Анна Вега',role:'AI-исследователь'},{name:'Марк Лин',role:'Frontend-инженер'},{name:'Алексей Мир',role:'Разработчик игр'}];
window.novaEvents = [{day:1,track:'AI',time:'10:00 — 11:00',title:'Будущее искусственного интеллекта'},{day:1,track:'Web',time:'11:30 — 12:30',title:'Как браузер оживляет интерфейс'},{day:1,track:'GameDev',time:'13:00 — 14:00',title:'Мир, который создаёшь ты'},{day:2,track:'Web',time:'10:00 — 11:00',title:'Интерфейсы, которые понимают людей'},{day:2,track:'Robotics',time:'12:00 — 13:00',title:'Первый робот: от кода к движению'},{day:3,track:'AI',time:'10:00 — 11:00',title:'Данные и решения'},{day:3,track:'GameDev',time:'13:00 — 14:00',title:'Создаём игровой прототип'}];`;
function content(page: NovaPage): string {
  switch (page) {
    case "index":
      return `<div class="festival-meta"><span><i></i> ФЕСТИВАЛЬ ТЕХНОЛОГИЙ И НОВЫХ ИДЕЙ</span><span>12—14 АПРЕЛЯ / ЕКАТЕРИНБУРГ</span></div><section class="hero"><div class="hero-copy"><div class="festival-wordmark" aria-hidden="true">NOVA</div><h1 id="hero-title">Будущее ближе,<br>чем кажется.</h1><p class="hero-description">Место встречи людей, которые придумывают, создают и меняют мир. Три дня, чтобы увидеть технологии в действии — и найти своё направление.</p><div class="actions"><a class="btn black" href="tickets.html">Выбрать билет <span>↗</span></a><button id="open-modal">О фестивале <span>↗</span></button><button id="hello">Я с вами!</button></div><p id="greeting" aria-live="polite"></p></div>${art}</section><div class="metrics"><div><strong>3 дня</strong><span>погружения в технологии</span></div><div><strong>50+</strong><span>спикеров и новых взглядов</span></div><div><strong>8</strong><span>направлений будущего</span></div><div><strong>10 000+</strong><span>людей с общими идеями</span></div></div><section><div class="section-head"><div><span class="section-label">01 / НАЙДИ СВОЁ</span><h2>Выбери свой вектор.</h2></div><a href="tracks.html">Все направления ↗</a></div>${tracks()}<p id="track-choice" class="track-choice" aria-live="polite"></p></section><section class="editorial-banner"><div><span class="section-label">02 / БОЛЬШЕ, ЧЕМ ЛЕКЦИИ</span><h2>Не просто узнай.<br>Попробуй сам.</h2></div><div><p>От первой идеи до работающего прототипа. Воркшопы, открытые дискуссии и проекты, которые хочется обсуждать. Здесь можно задавать вопросы и находить своих.</p><a class="btn" href="program.html">Собрать свою программу ↗</a></div></section><dialog id="festival-modal" aria-labelledby="modal-title"><div class="label">NOVA / ВСТРЕТИМСЯ В БУДУЩЕМ</div><h2 id="modal-title">Идеи становятся реальностью.</h2><p>NOVA объединяет разработчиков, дизайнеров и исследователей. Три дня лекций, практики и новых знакомств.</p><p class="subtle">Учебный фестиваль. Даты и участники — демонстрационные данные.</p><button id="close-modal" class="black">Закрыть</button></dialog>`;
    case "about":
      return `<section class="about-layout"><div><div class="label">01 / МЕСТО, ГДЕ ВСТРЕЧАЮТСЯ ИДЕИ</div><h1>О фестивале</h1><p>NOVA — это любопытство, превращённое в событие. Фестиваль о людях и технологиях, которые помогают смотреть на привычное по-новому.</p><p>Увидеть. Обсудить. Попробовать. Три дня без границ между вдохновением и первым шагом.</p><button id="about-toggle" class="black" aria-expanded="false" aria-controls="about-details">Подробнее</button><div id="about-details" hidden><p>Попробуй новое на практических воркшопах, найди единомышленников и покажи свой первый проект. Программа открыта для новичков: важнее любопытство, чем опыт.</p></div></div>${art}</section><div class="features">${[
        ["↗", "Новые взгляды", "Лекции и открытые дискуссии"],
        ["⌘", "Опыт своими руками", "Практические воркшопы"],
        ["◇", "Идеи в действии", "Выставка проектов"],
        ["✳", "Своё сообщество", "Знакомства и обмен опытом"],
      ]
        .map(
          ([icon, title, text]) =>
            `<div><span aria-hidden="true">${icon}</span><p><strong>${title}</strong><br>${text}</p></div>`,
        )
        .join(
          "",
        )}</div><p class="about-footnote">Интерес к будущему — единственный обязательный навык.</p>`;
    case "tracks":
      return `${intro("02", "ТЕХНОЛОГИИ / ВОЗМОЖНОСТИ", "Направления", "У каждого — свой путь в технологии. Найди тему, которая заставляет задавать вопросы и пробовать новое.")}${tracks()}<div class="callout">Твой выбор: <strong id="track-choice" aria-live="polite">пока не выбран</strong></div><div class="section-head subhead"><div><span class="section-label">БОЛЬШЕ ТОЧЕК ВХОДА</span><h2>Любопытство без границ.</h2></div></div><div class="track-extra"><span>Design / Визуальные системы</span><span>Data / Данные и аналитика</span><span>Hardware / Устройства</span><span>Career / Новая профессия</span></div><p class="subtle">Посмотри события по направлениям и выбери то, что хочется попробовать.</p><a class="btn black" href="program.html">К программе ↗</a>`;
    case "program":
      return `${intro("03", "ВЫБИРАЙ СВОЙ РИТМ", "Программа", "Открывай новые темы, встречай людей и оставляй время на неожиданные открытия. Собери свой маршрут по фестивалю.")}<div class="filters">${[1, 2, 3].map((day) => `<button class="day-tab ${day === 1 ? "active" : ""}" data-day="${day}">День ${day}<small>${11 + day} апреля / NOVA</small></button>`).join("")}<label class="filter-label" for="program-track">Направление</label><select id="program-track"><option value="all">Все направления</option><option>AI</option><option>Web</option><option>GameDev</option><option>Robotics</option></select></div><div id="events-list"></div><p id="program-empty" class="callout" hidden>В этот день событий по направлению нет. Попробуйте другой фильтр.</p><p class="subtle">Время местное. Программа демонстрационного фестиваля.</p>`;
    case "speakers":
      return `${intro("04", "ЛЮДИ / ОПЫТ / НОВЫЕ ВЗГЛЯДЫ", "Спикеры", "Те, кто создаёт продукты, исследует неизвестное и умеет делиться опытом. Большие идеи начинаются с хорошего разговора.")}<div id="speakers-list" class="speaker-grid"></div><div class="speaker-empty">Знакомство со спикерами — уже скоро. А пока выбери своё направление.</div><p class="subtle">Имена и роли участников приведены для учебной демонстрации.</p>`;
    case "tickets":
      return `${intro("05", "ТВОЙ ВХОД В НОВЫЙ ОПЫТ", "Билеты", "Один фестиваль — разные возможности. Выбери свой формат: от первого знакомства до полного погружения.")}<div class="ticket-grid">${[
        [
          "Студенческий",
          2500,
          ["Все лекции", "Выставочная зона", "Материалы фестиваля"],
        ],
        [
          "Стандарт",
          5000,
          ["Все лекции", "Выставочная зона", "Мастер-классы", "Нетворкинг"],
        ],
        [
          "VIP",
          12000,
          ["Всё из Стандарта", "Встречи со спикерами", "Подарочный набор"],
        ],
      ]
        .map(
          ([name, price, features], i) =>
            `<article class="ticket ${i === 1 ? "featured" : ""}"><span class="ticket-kicker">${i === 1 ? "✳ БОЛЬШЕ ВПЕЧАТЛЕНИЙ" : "NOVA / ACCESS 0" + (i + 1)}</span><h3>${name}</h3><strong>${Number(price).toLocaleString("ru-RU")} <small>₽</small></strong><ul>${(features as string[]).map((f) => `<li>${f}</li>`).join("")}</ul><button data-price="${price}" class="${i === 0 ? "active" : ""}">Выбрать</button></article>`,
        )
        .join(
          "",
        )}</div><div class="calculator"><label for="quantity">Количество билетов <input id="quantity" type="number" min="1" max="10" step="1" value="1"></label><output id="ticket-total" aria-live="polite">2500 ₽</output></div><p class="base">Для компании: два студенческих билета — <span id="base-total">ещё не рассчитано</span></p><p class="subtle">Это учебный сайт: оплаты и бронирования нет.</p>`;
    case "contacts":
      return `${intro("06", "НЕ ТЕРЯЕМ СВЯЗЬ", "Контакты", "Есть идея, вопрос или желание быть частью фестиваля? Начнём с разговора.")}<div class="contacts"><div class="contact-details"><h2>Встретимся<br>в Екатеринбурге.</h2><p>⌖ Екатеринбург, ЭКСПО<br><span class="subtle">12—14 апреля / три дня технологий</span></p><p>↗ <a href="mailto:hello@nova.example">hello@nova.example</a></p><div class="map" role="img" aria-label="Схематическая карта площадки">⌖</div><p class="subtle">Демонстрационный фестиваль: адрес и почта — учебные данные.</p></div><form id="contact-form" novalidate><h2>Давай на связи.</h2><p>Оставь свой вопрос — начнём с самого интересного.</p><label>Имя<input name="name" autocomplete="name" required placeholder="Как к тебе обращаться?"></label><label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Сообщение<textarea name="message" required placeholder="Расскажи о своей идее или задай вопрос"></textarea></label><button type="submit" class="black">Проверить сообщение →</button><div id="form-status" role="status" aria-live="polite"></div></form></div>`;
  }
}
export function pageBody(page: NovaPage) {
  return `<header><a href="index.html" class="logo" aria-label="NOVA — главная"><b>TOP</b><span><strong>NOVA</strong>TECH FESTIVAL</span></a><nav id="site-nav" aria-label="Навигация фестиваля">${pages
    .filter((p) => p.id !== "index")
    .map(
      (p) =>
        `<a href="${p.id}.html" ${p.id === page ? 'aria-current="page"' : ""}>${p.name}</a>`,
    )
    .join(
      "",
    )}</nav><a class="btn purple" href="tickets.html">Билеты ↗</a><button id="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Открыть меню">☰</button></header><main>${content(page)}</main><footer class="footer"><div class="footer-top"><h2>Будущее интереснее,<br>когда мы вместе.</h2><a class="btn" href="tickets.html">Увидимся на NOVA ↗</a></div><div class="footer-wordmark" aria-hidden="true">NOVA</div><div class="footer-bottom"><span><b>ФЕСТИВАЛЬ ТЕХНОЛОГИЙ. ЛЮДЕЙ. ИДЕЙ.</b>Учебный проект TOP. Даты, участники и показатели демонстрационные.</span><span>12—14 АПРЕЛЯ / ЕКАТЕРИНБУРГ</span><div class="footer-links"><a href="about.html">О фестивале</a><a href="contacts.html">Контакты ↗</a></div></div></footer>`;
}
export function htmlFile(page: NovaPage) {
  return `<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOVA — ${pages.find((p) => p.id === page)?.name}</title><link rel="stylesheet" href="styles.css"><script src="data.js" defer></script>${lessons.map((l) => `<script src="scripts/stage-${l.id}.js" defer></script>`).join("")}</head><body>${pageBody(page)}</body></html>`;
}
export function projectFiles(
  codes: Record<string, string>,
  overrides: Record<string, string> = {},
) {
  const files: Record<string, string> = {
    "styles.css": novaCSS,
    "data.js": novaData,
    "assets/nova-orbit.webp": orbitImage.trim(),
  };
  pages.forEach((p) => (files[`${p.id}.html`] = htmlFile(p.id)));
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
