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
export const novaCSS = `
:root{font-family:Arial,'Segoe UI',sans-serif;color:#111116;background:#faf9fc;--purple:#7528dc;--light:#efedf2}*{box-sizing:border-box}body{margin:0}button,input,select,textarea{font:inherit}button,a{ -webkit-tap-highlight-color:transparent}a{color:inherit;text-decoration:none}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:3px solid #bd86ff;outline-offset:3px}header{display:flex;align-items:center;gap:22px;padding:25px 5%;border-bottom:1px solid #e6e2ed;position:relative;background:#fff;z-index:2}.logo{font-weight:900;font-size:32px;letter-spacing:-2px;position:relative}.logo:after{content:'';position:absolute;right:-6px;top:-2px;border-top:5px solid var(--purple);border-right:5px solid var(--purple);width:15px;height:15px}nav{display:flex;gap:19px;align-items:center;margin-left:auto}nav a{font-size:12px;font-weight:700}nav a[aria-current=page]{color:var(--purple)}.btn,button{padding:12px 20px;border-radius:24px;border:1px solid #bbb7c1;background:transparent;color:inherit;display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;font-size:13px}.btn:hover,button:hover{border-color:var(--purple);color:var(--purple)}.purple,button.active,.btn.purple{background:var(--purple);color:white;border-color:var(--purple)}#menu-toggle{padding:8px 12px;border:0;font-size:21px}main{max-width:1320px;margin:auto;padding:50px 5% 70px}h1{font-size:clamp(38px,5vw,65px);letter-spacing:-2px;line-height:1.05;margin:0 0 32px}h2{font-size:27px;letter-spacing:-.7px}h3{font-size:20px}p{line-height:1.65}.label{font-size:11px;letter-spacing:2px;font-weight:700;margin-bottom:23px}.hero{position:relative;min-height:470px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px;align-items:center}.hero h1{font-size:clamp(42px,6vw,84px);letter-spacing:-3px;overflow-wrap:anywhere;margin:0}.hero h1.custom{font-size:clamp(50px,6vw,82px);letter-spacing:-3px;margin:22px 0}.manifest{font-size:25px;font-weight:800;line-height:1.12;border-left:12px solid var(--purple);padding-left:24px;margin:26px 0}.actions{display:flex;flex-wrap:wrap;gap:13px;margin-top:24px}.art{position:relative;isolation:isolate;min-height:410px;overflow:hidden;background:linear-gradient(130deg,#f4f1f8 30%,#ece5f7);clip-path:polygon(12% 0,100% 0,100% 80%,84% 100%,0 100%,0 15%)}.art:before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 35%,#8d36ec 35%,#ac76f4 70%,transparent 70%);z-index:-1}.art svg{width:100%;height:100%;min-height:410px}.art .date{position:absolute;right:10px;bottom:15px;background:white;padding:17px;font-size:24px;font-weight:900;line-height:1.1}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;padding:25px;background:var(--light);margin:30px 0 45px;border-radius:5px}.metrics strong{display:block;font-size:24px}.metrics span{font-size:12px;color:#605b68}.section-head{display:flex;justify-content:space-between;align-items:center;gap:15px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.track{display:flex;flex-direction:column;text-align:left;justify-content:flex-end;min-height:230px;border-radius:12px;background:#191220;color:#fff;overflow:hidden;position:relative;padding:22px;border:3px solid transparent}.track:hover,.track.active{border-color:#ac65ff;color:#fff}.track strong{font-size:27px;z-index:1}.track small{margin-top:6px;max-width:160px;z-index:1;line-height:1.4}.track:before{content:'';position:absolute;border-radius:50%;width:190px;height:190px;right:-40px;top:-30px;background:repeating-radial-gradient(ellipse at 50% 50%,transparent 0,transparent 6px,#ac5fff 7px,#7d2cc2 8px,transparent 10px);transform:rotate(-28deg)}.track:nth-child(even){background:#e8e6ec;color:#161019}.track:nth-child(even):before{background:repeating-linear-gradient(35deg,transparent 0,transparent 12px,#bfbac8 13px,white 15px);border-radius:10px;transform:rotate(25deg)}.track:nth-child(even):hover,.track:nth-child(even).active{color:#161019}.track:nth-child(3):before{transform:rotate(50deg);width:300px;height:280px;opacity:.6}.subtle{font-size:13px;color:#77717f}.callout{background:#efebf6;border-left:4px solid var(--purple);padding:18px 22px;border-radius:4px;margin:20px 0}.about-layout{display:grid;grid-template-columns:1fr 1.1fr;gap:70px;align-items:center}.about-layout p{font-size:19px}.architecture{height:300px;background:linear-gradient(150deg,#f3f1f8,#d5d1dc);position:relative;overflow:hidden;clip-path:polygon(0 20%,70% 0,100% 20%,100% 80%,30% 100%,0 80%)}.architecture:before{content:'';position:absolute;inset:30px -60px;background:repeating-linear-gradient(90deg,#9f99ac 0,#9f99ac 2px,transparent 2px,transparent 24px),repeating-linear-gradient(0deg,#928a9e 0,#928a9e 2px,transparent 2px,transparent 32px);transform:skewY(-20deg);border-bottom:15px solid var(--purple)}.features{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;margin-top:55px}.features span{font-size:30px;color:var(--purple)}.features p{font-weight:600;font-size:13px}.filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:26px 0}.day-tab{border-radius:9px;min-width:135px;background:var(--light);border:0;padding:19px}.day-tab small{display:block}.filter-label{margin-left:auto;font-size:12px}.event-row{display:grid;grid-template-columns:120px 1fr 70px;align-items:center;gap:20px;padding:22px 0;border-bottom:1px solid #ddd8e5}.event-row h2{font-size:18px;margin:0}.event-row span{font-size:12px}.event-row span:last-child{color:var(--purple);text-align:right}.speaker-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin:35px 0}.speaker-card{border-radius:10px;overflow:hidden;background:linear-gradient(140deg,#151019,#39234f);color:white;min-height:350px;padding:235px 24px 25px;position:relative}.speaker-card:before{content:'';position:absolute;top:25px;left:calc(50% - 65px);width:130px;height:150px;border-radius:45% 45% 40% 40%;background:linear-gradient(125deg,#ded8e5,#7e738d);box-shadow:0 95px 0 43px #a990ba;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:.85}.speaker-card:nth-child(2){background:linear-gradient(140deg,#6822bb,#a863f4)}.speaker-card:nth-child(3){background:linear-gradient(140deg,#24212b,#666171)}.speaker-card h2,.speaker-card p{position:relative;margin:0;background:#1b1325d9;padding:5px}.speaker-card h2{font-size:21px}.speaker-card p{font-size:13px;color:#ddd0e9}.ticket-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.ticket{padding:28px;background:var(--light);border-radius:12px;border:1px solid #e5dfea;display:flex;flex-direction:column}.ticket.featured{background:var(--purple);color:#fff}.ticket strong{font-size:35px}.ticket ul{padding-left:18px;font-size:13px;line-height:2;flex:1}.ticket button{width:100%;background:white;color:#5517a1}.ticket button.active{outline:3px solid #ae88e2;outline-offset:3px}.calculator{display:flex;align-items:center;gap:24px;flex-wrap:wrap;background:var(--light);border-radius:10px;padding:25px;margin-top:25px}.calculator label{font-size:14px}.calculator input{width:80px;margin-left:10px}.calculator output{margin-left:auto;font-size:24px;font-weight:800}.base{font-size:12px;color:#6a6174}.contacts{display:grid;grid-template-columns:1fr 1fr;gap:60px}.contact-details p{margin:25px 0}.map{width:100%;height:180px;border-radius:9px;background:repeating-linear-gradient(32deg,transparent 0,transparent 27px,#fff 28px,#fff 34px),repeating-linear-gradient(130deg,#e7e3ed 0,#e7e3ed 45px,#fff 46px,#fff 52px);display:grid;place-items:center;color:var(--purple);font-size:47px;border-right:7px solid var(--purple)}form{display:flex;flex-direction:column;gap:16px}label{font-weight:600;font-size:13px}input,select,textarea{padding:12px;border:1px solid #ccc4d5;border-radius:6px;background:white;color:#17111d}form input,form textarea{width:100%;margin-top:7px}textarea{resize:vertical;min-height:100px}form button{align-self:flex-start}#form-status{min-height:45px;font-size:13px}.footer{border-top:1px solid #e5dfea;padding:25px 5%;display:flex;justify-content:space-between;gap:20px;font-size:11px;color:#766d82}dialog{max-width:500px;width:85%;border:0;border-radius:14px;padding:35px;box-shadow:0 30px 100px #140c2299}dialog::backdrop{background:#17101eaa;backdrop-filter:blur(5px)}dialog h2{margin-top:0}[hidden]{display:none!important}@media(prefers-reduced-motion:no-preference){.track{transition:transform .2s,border-color .2s}.track:hover{transform:translateY(-4px)}}@media(max-width:1000px){header{gap:16px}nav{gap:12px}nav a{font-size:10px}header>.btn{display:none}.hero{min-height:350px}.art{min-height:330px}.art svg{min-height:330px}.grid{grid-template-columns:repeat(2,1fr)}.speaker-card{padding-left:15px;padding-right:15px}.about-layout{gap:25px}}@media(max-width:650px){header{padding:20px 5%;justify-content:space-between}#menu-toggle{margin-left:auto}nav{display:none;position:absolute;left:0;right:0;top:74px;flex-direction:column;padding:22px;background:#fff;box-shadow:0 20px 30px #19102118}nav.open{display:flex}nav a{font-size:14px}main{padding-top:30px}.hero{grid-template-columns:1fr}.hero h1{font-size:46px;letter-spacing:-2px}.hero h1.custom{font-size:45px}.manifest{font-size:20px}.art{min-height:280px}.art svg{min-height:280px}.metrics{grid-template-columns:repeat(2,1fr)}.grid{gap:12px}.track{min-height:190px;padding:15px}.about-layout,.contacts{grid-template-columns:1fr}.features{grid-template-columns:repeat(2,1fr)}.speaker-grid,.ticket-grid{grid-template-columns:1fr}.speaker-card{min-height:330px}.event-row{grid-template-columns:70px 1fr;gap:12px}.event-row span:last-child{display:none}.day-tab{min-width:85px;padding:13px}.filter-label{margin-left:0}.calculator output{margin-left:0}.footer{flex-direction:column}.section-head{align-items:flex-start}.section-head h2{font-size:23px}}
`;
const art = `<div class="art" aria-label="Геометрическая композиция: человек и технологии"><svg viewBox="0 0 420 450" role="img" aria-label="Оригинальная иллюстрация цифрового человека"><defs><linearGradient id="stone" x1="0" x2="1"><stop stop-color="#ebe6f0"/><stop offset=".5" stop-color="#a8a0b1"/><stop offset="1" stop-color="#514b5b"/></linearGradient><linearGradient id="visor"><stop stop-color="#8e21f3" stop-opacity=".9"/><stop offset=".5" stop-color="#d3a8ff" stop-opacity=".5"/><stop offset="1" stop-color="#7422d3"/></linearGradient></defs><path d="M55 450L85 330Q110 300 160 300L160 268Q120 237 120 175Q110 85 192 60Q295 30 315 133L300 221Q285 250 255 270L255 305Q322 320 355 450" fill="url(#stone)"/><path d="M120 152Q94 74 152 44Q204 9 252 51Q318 42 325 123L293 150L278 96L240 111L215 78L180 113L145 100Z" fill="#292530"/><path d="M110 135L305 120L307 183L114 198Z" fill="url(#visor)" stroke="#ae6af4" stroke-width="7"/><path d="M139 142L154 182M176 137L188 178M265 129L274 174" stroke="#e6c7ff" stroke-width="6" opacity=".8"/><path d="M215 197L229 223L208 230M183 252Q217 265 248 245" fill="none" stroke="#6d6477" stroke-width="5"/><path d="M111 329L199 376L280 322M82 356L191 410L322 350" fill="none" stroke="#e6e0eb" stroke-width="10"/></svg><div class="date">12 — 14<br>АПРЕЛЯ<small style="display:block;font-size:12px;margin-top:10px">ЕКАТЕРИНБУРГ / ЭКСПО</small></div></div>`;
const tracks = () =>
  `<div class="grid">${[
    ["AI", "Искусственный интеллект"],
    ["GameDev", "Разработка игр"],
    ["Web", "Веб-технологии"],
    ["Robotics", "Робототехника"],
  ]
    .map(
      ([name, text]) =>
        `<button type="button" class="track" data-track="${name}" aria-label="Выбрать ${name}"><strong>${name}</strong><small>${text} ↗</small></button>`,
    )
    .join("")}</div>`;
export const novaData = `window.novaSpeakers = [{name:'Анна Вега',role:'AI-исследователь'},{name:'Марк Лин',role:'Frontend-инженер'},{name:'Алексей Мир',role:'Разработчик игр'}];
window.novaEvents = [{day:1,track:'AI',time:'10:00 — 11:00',title:'Будущее искусственного интеллекта'},{day:1,track:'Web',time:'11:30 — 12:30',title:'Как браузер оживляет интерфейс'},{day:1,track:'GameDev',time:'13:00 — 14:00',title:'Мир, который создаёшь ты'},{day:2,track:'Web',time:'10:00 — 11:00',title:'Интерфейсы, которые понимают людей'},{day:2,track:'Robotics',time:'12:00 — 13:00',title:'Первый робот: от кода к движению'},{day:3,track:'AI',time:'10:00 — 11:00',title:'Данные и решения'},{day:3,track:'GameDev',time:'13:00 — 14:00',title:'Создаём игровой прототип'}];`;
function content(page: NovaPage): string {
  switch (page) {
    case "index":
      return `<div class="hero"><div><div class="label">— ТЕХНОЛОГИЧЕСКИЙ ФЕСТИВАЛЬ</div><h1 id="hero-title">NOVA</h1><div class="manifest">ТЕХНОЛОГИИ /<br>ЛЮДИ /<br>ИДЕИ</div><div class="actions"><a class="btn purple" href="tickets.html">Купить билет →</a><button id="open-modal">▷ О фестивале</button><button id="hello">Я с вами!</button></div><p id="greeting" aria-live="polite"></p></div>${art}</div><div class="metrics"><div><strong>3 дня</strong><span>фестиваля</span></div><div><strong>50+</strong><span>спикеров</span></div><div><strong>8</strong><span>направлений</span></div><div><strong>10 000+</strong><span>участников</span></div></div><div class="section-head"><h2>Направления фестиваля</h2><a href="tracks.html">Все направления ↗</a></div>${tracks()}<p id="track-choice" aria-live="polite"></p><dialog id="festival-modal" aria-labelledby="modal-title"><h2 id="modal-title">Идеи становятся реальностью</h2><p>NOVA объединяет разработчиков, дизайнеров и исследователей. Три дня лекций, практики и новых знакомств.</p><p class="subtle">Учебный фестиваль. Даты и участники — демонстрационные данные.</p><button id="close-modal">Закрыть</button></dialog>`;
    case "about":
      return `<div class="about-layout"><div><div class="label">NOVA / О НАС</div><h1>О фестивале</h1><p>NOVA — технологический фестиваль о людях, идеях и технологиях, которые меняют мир.</p><button id="about-toggle" aria-expanded="false" aria-controls="about-details">Подробнее</button><div id="about-details" hidden><p>Попробуй новое на практических воркшопах, найди единомышленников и покажи свой первый проект. Программа открыта для новичков: важнее любопытство, чем опыт.</p></div></div><div class="architecture" role="img" aria-label="Геометрическая архитектура будущего"></div></div><div class="features">${[
        ["◩", "Лекции и дискуссии"],
        ["⌘", "Практические воркшопы"],
        ["◇", "Выставка проектов"],
        ["♧", "Знакомства и сообщество"],
      ]
        .map(
          ([icon, title]) => `<div><span>${icon}</span><p>${title}</p></div>`,
        )
        .join("")}</div>`;
    case "tracks":
      return `<div class="label">ВЫБЕРИ СВОЙ ВЕКТОР</div><h1>Направления</h1><p>От первой строки до собственного изобретения. Какое направление твоё?</p>${tracks()}<div class="callout">Ваш выбор: <strong id="track-choice" aria-live="polite">пока не выбран</strong></div><h2>И ещё больше идей</h2><p>Design — визуальные системы · Data — данные и аналитика · Hardware — устройства · Career — профессии будущего.</p><a class="btn purple" href="program.html">Посмотреть программу →</a>`;
    case "program":
      return `<div class="label">ТРИ ДНЯ ОТКРЫТИЙ</div><h1>Программа</h1><div class="filters">${[1, 2, 3].map((day) => `<button class="day-tab ${day === 1 ? "active" : ""}" data-day="${day}">День ${day} <small>${11 + day} апреля</small></button>`).join("")}<label class="filter-label" for="program-track">Направление</label><select id="program-track"><option value="all">Все направления</option><option>AI</option><option>Web</option><option>GameDev</option><option>Robotics</option></select></div><div id="events-list"></div><p id="program-empty" class="callout" hidden>В этот день событий по направлению нет. Попробуйте другой фильтр.</p><p class="subtle">Время местное. Учебная программа демонстрационного фестиваля.</p>`;
    case "speakers":
      return `<div class="label">ЛЮДИ, КОТОРЫЕ СОЗДАЮТ БУДУЩЕЕ</div><h1>Спикеры</h1><p>От исследований к реальным продуктам. Знакомьтесь с теми, кто делится опытом.</p><div id="speakers-list" class="speaker-grid"></div><div class="callout">После пятого этапа карточки здесь создаёт ваш JavaScript.</div>`;
    case "tickets":
      return `<div class="label">ТВОЙ БИЛЕТ В МИР ТЕХНОЛОГИЙ</div><h1>Билеты</h1><div class="ticket-grid">${[
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
            `<article class="ticket ${i === 1 ? "featured" : ""}"><h3>${name}</h3><strong>${Number(price).toLocaleString("ru-RU")} ₽</strong><ul>${(features as string[]).map((f) => `<li>${f}</li>`).join("")}</ul><button data-price="${price}" class="${i === 0 ? "active" : ""}">Выбрать</button></article>`,
        )
        .join(
          "",
        )}</div><div class="calculator"><label for="quantity">Количество билетов <input id="quantity" type="number" min="1" max="10" step="1" value="1"></label><output id="ticket-total" aria-live="polite">2500 ₽</output></div><p class="base">Учебный расчёт: два студенческих билета — <span id="base-total">ещё не рассчитано</span></p><p class="subtle">Это учебный сайт: оплаты и бронирования нет.</p>`;
    case "contacts":
      return `<div class="label">ДАВАЙТЕ НА СВЯЗЬ</div><h1>Контакты</h1><div class="contacts"><div class="contact-details"><h2>Встретимся в Екатеринбурге</h2><p>⌖ Екатеринбург, ЭКСПО</p><p>✉ <a href="mailto:hello@nova.example">hello@nova.example</a></p><div class="map" role="img" aria-label="Схематическая карта площадки">⌖</div><p class="subtle">Демонстрационный фестиваль: адрес и почта используются как учебные данные.</p></div><form id="contact-form" novalidate><label>Имя<input name="name" autocomplete="name" required placeholder="Как к вам обращаться?"></label><label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Сообщение<textarea name="message" required placeholder="Ваш вопрос"></textarea></label><button type="submit" class="purple">Проверить сообщение →</button><div id="form-status" role="status" aria-live="polite"></div></form></div>`;
  }
}
export function pageBody(page: NovaPage) {
  return `<header><a href="index.html" class="logo" aria-label="NOVA — главная">TOP</a><nav id="site-nav" aria-label="Навигация фестиваля">${pages
    .filter((p) => p.id !== "index")
    .map(
      (p) =>
        `<a href="${p.id}.html" ${p.id === page ? 'aria-current="page"' : ""}>${p.name}</a>`,
    )
    .join(
      "",
    )}</nav><a class="btn purple" href="tickets.html">Купить билет →</a><button id="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Открыть меню">☰</button></header><main>${content(page)}</main><footer class="footer"><span>NOVA / ТЕХНОЛОГИИ. ЛЮДИ. ИДЕИ.</span><span>Учебный проект TOP · 12—14 апреля</span><a href="contacts.html">Связаться с нами ↗</a></footer>`;
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

