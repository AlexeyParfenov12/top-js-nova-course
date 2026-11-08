export interface TrainerExample {
  instruction: string;
  markup: string;
  script: string;
}

const output = '<output id="result" aria-live="polite"></output>';
const button = (label: string) => '<button type="button" id="try">' + label + '</button>';

function demo(instruction: string, markup: string, script: string): TrainerExample {
  return { instruction, markup, script };
}

function valueDemo(instruction: string, label: string, expression: string): TrainerExample {
  return demo(instruction, '<p class="call">' + label + '</p>' + output, 'show(' + expression + ');');
}

const events = "const entries = [{title:'Лаборатория AI',day:1,track:'AI'},{title:'Интерфейсы',day:2,track:'Web'},{title:'Первый сайт',day:1,track:'Web'}];";
const dayChoice = '<label>День <select id="day"><option value="1">День 1</option><option value="2">День 2</option></select></label>';
const trackChoice = '<label>Направление <select id="track"><option value="all">Все</option><option value="AI">AI</option><option value="Web">Web</option></select></label>';

export const trainerExamples: Record<number, [TrainerExample, TrainerExample]> = {
  1: [
    demo(
      "Введи новую надпись и нажми «Изменить». Пример передаст её в твою функцию.",
      '<h2 id="hero-title">NOVA</h2><div class="fields"><label>Новая надпись <input id="title-input" value="Мой NOVA"></label>' + button('Изменить') + '</div>',
      "on('try', 'click', () => renameTitle(node('title-input').value));",
    ),
    demo(
      "Нажми кнопку в примере. Твой обработчик должен изменить её надпись.",
      '<button type="button" id="hello">Я с вами!</button>',
      "connectButton();",
    ),
  ],
  2: [
    demo(
      "Меняй цену и количество. Ниже появится значение, которое вернула твоя функция.",
      '<div class="fields"><label>Цена <input id="price" type="number" value="2500"></label><label>Количество <input id="count" type="number" value="2"></label></div>' + output,
      "const render = () => show(total(Number(node('price').value), Number(node('count').value))); on('price','input',render); on('count','input',render); render();",
    ),
    demo(
      "Цена приходит из поля строкой. Попробуй разные числа и сравни результат.",
      '<div class="fields"><label>Цена как строка <input id="price" value="2500" inputmode="numeric"></label><label>Количество <input id="count" type="number" value="2"></label></div>' + output,
      "const render = () => show(parseTotal(node('price').value, Number(node('count').value))); on('price','input',render); on('count','input',render); render();",
    ),
  ],
  3: [
    demo(
      "Нажми дважды. Смотри, появился ли класс и какое значение вернула функция.",
      '<p id="card" class="card">Карточка направления</p>' + button('Переключить класс') + output,
      "on('try', 'click', () => { const card = node('card'); const answer = toggleClass(card); show(answer, card.classList.contains('active') ? 'Класс active добавлен' : 'Класса active нет'); });",
    ),
    demo(
      "Нажимай разные карточки. Выделение показывает, у каких элементов остался класс active.",
      '<div class="fields"><button type="button" class="card choice">Web</button><button type="button" class="card choice">AI</button><button type="button" class="card choice">Robotics</button></div>',
      "const cards = Array.from(document.querySelectorAll('.choice')); cards.forEach((card) => card.addEventListener('click', () => choose(cards, card)));",
    ),
  ],
  4: [
    demo(
      "Нажми кнопку. Счётчик увеличится, только если твой код подключил переданное действие.",
      button('Нажми меня') + '<output id="result" aria-live="polite">Нажатий: 0</output>',
      "let count = 0; bindClick(node('try'), () => { count += 1; node('result').textContent = 'Нажатий: ' + count; });",
    ),
    demo(
      "Отправь в функцию Enter или Escape. Посмотри, закрылась ли панель.",
      '<div class="card" id="panel">Панель открыта</div><div class="fields"><button type="button" id="enter">Enter</button><button type="button" id="escape">Escape</button><button type="button" id="open">Открыть снова</button></div><output id="result" aria-live="polite">Панель открыта</output>',
      "const sendKey = (key) => keyboardAction({ key }, () => { node('panel').hidden = true; node('result').textContent = 'Панель закрыта'; }); on('enter','click',() => sendKey('Enter')); on('escape','click',() => sendKey('Escape')); on('open','click',() => { node('panel').hidden = false; node('result').textContent = 'Панель открыта'; });",
    ),
  ],
  5: [
    valueDemo(
      "Твоя функция получает два объекта. Посмотри, какой массив она собрала.",
      "Вход: [{ name: «Ада» }, { name: «Марк» }]",
      "names([{ name: 'Ада' }, { name: 'Марк' }])",
    ),
    demo(
      "Карточку ниже создаёт твоя функция. Переключи спикера и проверь имя и роль.",
      '<label>Спикер <select id="speaker"><option value="0">Ада</option><option value="1">Марк</option></select></label><div id="result" aria-live="polite"></div>',
      "const speakers = [{name:'Ада',role:'AI'},{name:'Марк',role:'Web'}]; const render = () => { const card = createCard(speakers[Number(node('speaker').value)]); if (card instanceof Node) node('result').replaceChildren(card); else show(card); }; on('speaker','change',render); render();",
    ),
  ],
  6: [
    demo(
      "Выбирай день. Вывод показывает массив событий, который вернула твоя функция.",
      dayChoice + output,
      events + "const render = () => show(byDay(entries, Number(node('day').value))); on('day','change',render); render();",
    ),
    demo(
      "Меняй день и направление. Например, для дня 2 и AI ожидается пустой массив.",
      '<div class="fields">' + dayChoice + trackChoice + '</div>' + output,
      events + "const render = () => show(selectAll(entries, Number(node('day').value), node('track').value)); on('day','change',render); on('track','change',render); render();",
    ),
  ],
  7: [
    demo(
      "Попробуй 2, 1.5 или очисти поле. Смотри, где функция возвращает число, а где null.",
      '<label>Ввод как строка <input id="count" value="2" inputmode="decimal"></label>' + output,
      "const render = () => show(readCount(node('count').value)); on('count','input',render); render();",
    ),
    demo(
      "Измени количество. Вывод появится, когда твой обработчик вызовет переданную функцию.",
      '<label>Количество <input id="count" type="number" value="3"></label><output id="result" aria-live="polite">Ждём нового ввода</output>',
      "bindQuantity(node('count'), (value) => show(value));",
    ),
  ],
  8: [
    demo(
      "Заполни поля по очереди. Вывод показывает первую ошибку, которую вернул твой код.",
      '<div class="fields"><label>Имя <input id="name"></label><label>Сообщение <input id="message"></label></div>' + output,
      "const render = () => show(required(node('name').value, node('message').value)); on('name','input',render); on('message','input',render); render();",
    ),
    demo(
      "Нажми «Отправить». Пример покажет, остановилась ли отправка и сколько раз выполнилось переданное действие.",
      '<form id="form"><label>Сообщение <input value="Привет, NOVA!"></label><button type="submit">Отправить</button></form><output id="result" aria-live="polite">Вызовов: 0</output>',
      "let calls = 0; const form = node('form'); bindForm(form, () => { calls += 1; }); form.addEventListener('submit', (event) => { const stopped = event.defaultPrevented; event.preventDefault(); node('result').textContent = (stopped ? 'Отправка остановлена' : 'Отправка не остановлена') + ' · Вызовов: ' + calls; });",
    ),
  ],
  9: [
    demo(
      "Проверь обе кнопки. Если элемента нет, функция должна завершиться без ошибки.",
      '<h2 id="target">NOVA</h2><div class="fields"><button type="button" id="found">Элемент найден</button><button type="button" id="missing">Элемента нет</button></div>' + output,
      "on('found','click',() => { safeRename(node('target'), 'Готово'); node('result').textContent = 'Заголовок: ' + node('target').textContent; }); on('missing','click',() => { safeRename(null, 'Готово'); node('result').textContent = 'Вызов с null завершился без ошибки'; });",
    ),
    demo(
      "Открой и закрой блок. Сравни его видимость, подпись кнопки и значение aria-expanded.",
      '<button type="button" id="try" aria-expanded="false">Подробнее</button><p id="details" class="card" hidden>Информация о фестивале NOVA</p><output id="result" aria-live="polite">aria-expanded: false</output>',
      "on('try','click',() => { const control = node('try'); toggleDetails(control,node('details')); node('result').textContent = 'aria-expanded: ' + control.getAttribute('aria-expanded'); });",
    ),
  ],
};

const style = `
  *{box-sizing:border-box}body{margin:0;padding:12px;background:#fff;color:#251d38;font:14px/1.45 system-ui,sans-serif}
  h2,p{margin:0 0 8px}h2{font-size:20px;overflow-wrap:anywhere}
  .fields,form{display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-bottom:8px}
  label{display:inline-flex;flex-direction:column;gap:4px;font-size:12px;color:#5d506e;max-width:100%;margin-bottom:4px}
  button,input,select{font:inherit;padding:6px 9px;border:1px solid #ded4e8;border-radius:6px;background:#fff;color:#2b2043;max-width:100%}
  button{cursor:pointer;background:#f4eef9;font-weight:650}
  input{width:132px}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #8d62bf;outline-offset:2px}
  output:not(:empty){display:block;margin-top:8px;padding:7px 9px;border-radius:6px;background:#f5f0fa;white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.45 Consolas,monospace}
  .call{font:12px/1.5 Consolas,monospace;color:#5d506e}
  .card,.speaker-card{padding:8px 11px;margin:6px 0;border:1px solid #dfd4ea;border-radius:7px;background:#faf7fd}
  .card.active{background:#623bab;color:#fff;border-color:#623bab}
  .speaker-card p,.speaker-card h2{margin:0}
`;

export function trainerExampleFiles(example: TrainerExample, code: string) {
  return {
    "index.html": example.markup,
    "styles.css": style,
    "data.js": "",
    "scripts/stage-10.js": code,
    "scripts/stage-11.js": "(() => {\n"
      + "const node = (id) => document.getElementById(id);\n"
      + "const on = (id, event, action) => node(id).addEventListener(event, action);\n"
      + "const show = (value, note) => { const kind = value === null ? 'null' : Array.isArray(value) ? 'массив' : typeof value; const shown = JSON.stringify(value, null, Array.isArray(value) ? 2 : 0) ?? String(value); node('result').textContent = (note ? note + '\\n' : '') + shown + ' · ' + kind; };\n"
      + example.script + "\n})();",
  };
}
