import type { Lesson } from "./types";

const speakerCardSolution = `function createCard(person) {
  const card = document.createElement('article');
  card.className = 'speaker-card';
  const name = document.createElement('h2');
  name.textContent = person.name;
  const role = document.createElement('p');
  role.textContent = person.role;
  card.append(name, role);
  return card;
}`;

const emailFormat = String.raw`function hasEmailFormat(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}`;

export const days = [
  "Основы JavaScript",
  "DOM и работа с данными",
  "Завершение сайта",
];
export const lessons: Lesson[] = [
  {
    id: 1,
    day: 1,
    title: "Первые строки JavaScript",
    short: "Дай странице голос",
    page: "index",
    feature: "Заголовок и первая работающая кнопка",
    goal: "Найти элемент страницы, изменить его текст и отреагировать на нажатие пользователя.",
    exercises: [
      {
        slot: 3,
        title: "Поменяй заголовок",
        prompt:
          "Измени заголовок страницы. В заготовке уже есть функция renameTitle(text); внутри найди #hero-title и запиши переданный текст.",
        starter:
          "function renameTitle(text) {\n  // Найди #hero-title, сохрани его в title и запиши text в title.textContent.\n}",
        solution:
          `function renameTitle(text) {
  const title = document.querySelector('#hero-title');
  title.textContent = text;
}`,
        tests:
          "renameTitle('Первый запуск'); equal(q('#hero-title').textContent,'Первый запуск'); renameTitle('Мой NOVA'); equal(q('#hero-title').textContent,'Мой NOVA');",
        hint: "Имя text — уже готовый вход функции. Его не нужно заключать в кавычки.",
      },
      {
        slot: 5,
        title: "Подключи кнопку",
        prompt:
          "Настрой кнопку: после вызова connectButton() клик по #hello должен менять её текст на «Я иду на NOVA». До клика текст не меняется.",
        starter:
          "function connectButton() {\n  const button = document.querySelector('#hello');\n  // Подключи click к button. Внутри обработчика измени надпись кнопки.\n}",
        solution:
          `function connectButton() {
  const button = document.querySelector('#hello');
  button.addEventListener('click', () => {
    button.textContent = 'Я иду на NOVA';
  });
}`,
        tests:
          "const before=q('#hello').textContent; connectButton(); equal(q('#hello').textContent,before); q('#hello').click(); equal(q('#hello').textContent,'Я иду на NOVA');",
        hint: "Записывай новый textContent внутри функции, переданной в addEventListener.",
      },
    ],
    task: "В index.html уже есть #hero-title, #hello и #greeting. Сделай заголовок «NOVA - будущее начинается здесь». При клике по #hello выведи в #greeting «Увидимся на NOVA!».",
    requirements: [
      "Измени textContent заголовка #hero-title.",
      "Зарегистрируй обработчик click у #hello.",
      "Выведи приветствие только после клика.",
    ],
    starter:
      `const title = document.querySelector('#hero-title');
if (title) {
  // 1. Замени надпись в следующей строке. Оставь присваивание внутри if (title).
  title.textContent = 'NOVA';

  const button = document.querySelector('#hello');
  const greeting = document.querySelector('#greeting');
  // 2. Подключи click к button. Внутри функции запиши приветствие в greeting.textContent.
}
`,
    solution:
      `const title = document.querySelector('#hero-title');
if (title) {
  title.textContent = 'NOVA - будущее начинается здесь';

  const button = document.querySelector('#hello');
  const greeting = document.querySelector('#greeting');
  button.addEventListener('click', () => {
    greeting.textContent = 'Увидимся на NOVA!';
  });
}`,
    hints: [
      "Все три элемента уже найдены. Оставь команды внутри блока if (title), который работает на главной.",
      "Изменяй .textContent. Обработчик регистрируется через addEventListener.",
      "button.addEventListener('click', () => { greeting.textContent = 'Увидимся на NOVA!'; });",
    ],
    tests:
      "test('Заголовок изменён',()=>equalText(q('#hero-title').textContent,'NOVA - будущее начинается здесь')); test('Приветствие ждёт клика',()=>equal(q('#greeting').textContent,'')); test('Кнопка отвечает на клик',()=>{q('#hello').click(); equal(q('#greeting').textContent,'Увидимся на NOVA!');});",
    summary:
      "Ты связал JavaScript с DOM: нашёл элементы, изменил текст и зарегистрировал первое событие.",
  },
  {
    id: 2,
    day: 1,
    title: "Переменные, типы и вычисления",
    short: "Рассчитай стоимость",
    page: "tickets",
    feature: "Базовая формула билетов",
    goal: "Различать строки и числа, выполнять вычисления и возвращать результат из функции.",
    exercises: [
      {
        slot: 0,
        title: "Посчитай цену заказа",
        prompt: "Функция total получает цену и количество. Верни стоимость.",
        starter: "function total(price, count) {\n  return 0; // Замени 0 на произведение price и count.\n}",
        solution: `function total(price, count) {
  return price * count;
}`,
        tests:
          "equal(total(2500,2),5000); equal(total(5000,3),15000); equal(total(10,0),0);",
        hint: "Используй умножение price * count.",
      },
      {
        slot: 3,
        title: "Преобразуй строку в число",
        prompt: "Цена приходит строкой. Верни число — стоимость count билетов.",
        starter:
          "function parseTotal(rawPrice,count) {\n  return rawPrice + count; // Сначала преврати rawPrice в число, затем умножь на count.\n}",
        solution:
          `function parseTotal(rawPrice, count) {
  const price = Number(rawPrice);
  return price * count;
}`,
        tests:
          "equal(parseTotal('2500',2),5000); equal(parseTotal('12000',3),36000);",
        hint: "Преобразуй rawPrice через Number перед умножением.",
      },
    ],
    task: "Создай window.calculateBase(price, count): возвращай произведение цены и количества. Запиши в #base-total результат расчёта двух студенческих билетов по 2500 ₽ — «5000 ₽».",
    requirements: [
      "Функция доступна как window.calculateBase.",
      "Работает для разных цен и количества, включая 0.",
      "В #base-total отображается 5000 ₽.",
    ],
    starter:
      "window.calculateBase = function(price, count) {\n  return 0; // Верни произведение цены и количества.\n};\n// Найди #base-total. Если он есть, вызови calculateBase(2500, 2) и покажи сумму со знаком ₽.\n",
    solution:
      `window.calculateBase = function(price, count) {
  return price * count;
};

const output = document.querySelector('#base-total');
if (output) {
  const total = window.calculateBase(2500, 2);
  output.textContent = total + ' ₽';
}`,
    hints: [
      "Сначала реализуй чистую функцию, затем найди элемент вывода.",
      "return price * count;",
      "output.textContent = window.calculateBase(2500, 2) + ' ₽';",
    ],
    tests:
      "test('Два билета',()=>equal(window.calculateBase(2500,2),5000)); test('Другой тариф',()=>equal(window.calculateBase(5000,3),15000)); test('Нулевое количество',()=>equal(window.calculateBase(2500,0),0)); test('Стоимость на странице',()=>equal(q('#base-total').textContent,'5000 ₽'));",
    summary:
      "Теперь ты различаешь числа и строки, выполняешь вычисления и используешь параметры функции.",
  },
  {
    id: 3,
    day: 1,
    title: "Условия и управление интерфейсом",
    short: "Управляй состоянием",
    page: "tracks",
    feature: "Мобильное меню и активное направление",
    goal: "Использовать boolean, условия и CSS-классы для состояния интерфейса.",
    exercises: [
      {
        slot: 4,
        title: "Переключи класс",
        prompt:
          "toggleClass(node) должна переключать класс active и возвращать новое состояние.",
        starter:
          "function toggleClass(node) {\n  // Переключи 'active' через node.classList.toggle и верни его результат.\n}",
        solution:
          `function toggleClass(node) {
  return node.classList.toggle('active');
}`,
        tests:
          "const node=document.createElement('div'); equal(toggleClass(node),true); ok(node.classList.contains('active')); equal(toggleClass(node),false); ok(!node.classList.contains('active'));",
        hint: "classList.toggle возвращает boolean.",
      },
      {
        slot: 5,
        title: "Выбери одну карточку",
        prompt:
          "Выдели выбранную карточку: функция choose(cards,selected) оставляет active только у selected.",
        starter:
          "function choose(cards, selected) {\n  // Пройди по cards через forEach. Передай card === selected вторым аргументом toggle.\n}",
        solution:
          `function choose(cards, selected) {
  cards.forEach((card) => {
    card.classList.toggle('active', card === selected);
  });
}`,
        tests:
          "const cards=[document.createElement('button'),document.createElement('button')];choose(cards,cards[0]);choose(cards,cards[1]);ok(!cards[0].classList.contains('active'));ok(cards[1].classList.contains('active'));",
        hint: "В toggle второй аргумент ставит класс при true и снимает при false. Сравни card с selected.",
      },
    ],
    task: "На #menu-toggle переключай класс open у #site-nav и aria-expanded у кнопки. На странице направлений сделай ровно одну .track.active при выборе карточки. Покажи её data-track в #track-choice.",
    requirements: [
      "Меню открывается и закрывается.",
      "aria-expanded соответствует меню.",
      "Выбранное направление имеет active; старое теряет класс.",
    ],
    starter:
      "const menu = document.querySelector('#menu-toggle');\nconst nav = document.querySelector('#site-nav');\n// Подпиши menu на click. Переключи 'open' у nav и запиши новое состояние в aria-expanded.\n\n// Найди .track. В клике обнови active у всей группы и покажи выбранный data-track.\n",
    solution:
      `const menu = document.querySelector('#menu-toggle');
const nav = document.querySelector('#site-nav');
menu.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(isOpen));
});

const cards = document.querySelectorAll('.track');
cards.forEach((selected) => {
  selected.addEventListener('click', () => {
    cards.forEach((card) => {
      card.classList.toggle('active', card === selected);
    });
    const choice = document.querySelector('#track-choice');
    choice.textContent = selected.dataset.track;
  });
});`,
    hints: [
      "toggle возвращает новое состояние класса.",
      "Внутри клика пройди по всем карточкам и используй toggle('active', card === selected).",
      "selected.dataset.track читает HTML-атрибут data-track. menu.setAttribute('aria-expanded', String(isOpen));",
    ],
    tests:
      "test('Меню открывается',()=>{q('#menu-toggle').click(); ok(q('#site-nav').classList.contains('open')); equal(q('#menu-toggle').getAttribute('aria-expanded'),'true');}); test('Меню закрывается',()=>{q('#menu-toggle').click(); ok(!q('#site-nav').classList.contains('open'));}); test('Выбор направления',()=>{q('.track').click(); equal(document.querySelectorAll('.track.active').length,1); equal(q('#track-choice').textContent,q('.track').dataset.track);}); test('Старый выбор сбрасывается',()=>{const cards=document.querySelectorAll('.track'); cards[1].click(); equal(document.querySelectorAll('.track.active').length,1); ok(cards[1].classList.contains('active'));});",
    summary:
      "Условия помогают выбирать поведение, а CSS-классы — хранить видимое состояние интерфейса.",
  },
  {
    id: 4,
    day: 2,
    title: "Функции и события",
    short: "Открой диалог",
    page: "index",
    feature: "Модальное окно с клавиатурным управлением",
    goal: "Переиспользовать функции и обрабатывать click и keydown.",
    exercises: [
      {
        slot: 3,
        title: "Подпиши кнопку на клик",
        prompt:
          "Создай bindClick(button,callback): зарегистрируй callback для click, не вызывая его сразу.",
        starter:
          "function bindClick(button,callback) {\n  // Добавь button.addEventListener для 'click'. Передай callback без вызова.\n}",
        solution:
          `function bindClick(button, callback) {
  button.addEventListener('click', callback);
}`,
        tests:
          "const button=document.createElement('button');let count=0;bindClick(button,()=>count++);equal(count,0);button.click();button.click();equal(count,2);",
        hint: "В addEventListener передаётся callback без скобок.",
      },
      {
        slot: 4,
        title: "Отреагируй на Escape",
        prompt:
          "Обработчик keyboardAction(event,close) вызывает close только для Escape.",
        starter:
          "function keyboardAction(event,close) {\n  // Сравни event.key с 'Escape'. Только внутри if вызови close().\n}",
        solution:
          `function keyboardAction(event, close) {
  if (event.key === 'Escape') {
    close();
  }
}`,
        tests:
          "let count=0;keyboardAction({key:'Enter'},()=>count++);equal(count,0);keyboardAction({key:'Escape'},()=>count++);equal(count,1);",
        hint: "Сравни event.key со строкой Escape.",
      },
    ],
    task: "Кнопка #open-modal открывает dialog#festival-modal через showModal(). #close-modal и клавиша Escape закрывают его. Повторное открытие тоже работает.",
    requirements: [
      "Окно открывается по кнопке.",
      "Окно закрывается по кнопке.",
      "Escape закрывает открытое окно.",
    ],
    starter:
      `const dialog = document.querySelector('#festival-modal');
if (dialog) {
  // Объяви openDialog и closeDialog. Проверь dialog.open перед действием.
  // Подключи клики к #open-modal и #close-modal. На keydown обработай только Escape.
}
`,
    solution:
      `const dialog = document.querySelector('#festival-modal');
if (dialog) {
  function openDialog() {
    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function closeDialog() {
    if (dialog.open) {
      dialog.close();
    }
  }

  const openButton = document.querySelector('#open-modal');
  const closeButton = document.querySelector('#close-modal');
  openButton.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDialog();
    }
  });
}`,
    hints: [
      "Найди dialog и обе кнопки.",
      "Передай функцию в addEventListener без вызова.",
      "В keydown проверь event.key === 'Escape', затем вызови closeDialog().",
    ],
    tests:
      "test('Открытие окна',()=>{q('#open-modal').click(); ok(q('#festival-modal').open);}); test('Закрытие кнопкой',()=>{q('#close-modal').click(); ok(!q('#festival-modal').open);}); test('Повторное открытие и Escape',()=>{q('#open-modal').click(); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); ok(!q('#festival-modal').open);});",
    summary:
      "Ты разделил регистрацию события и выполнение функции, добавил мышь и клавиатуру.",
  },
  {
    id: 5,
    day: 2,
    title: "Массивы, объекты и DOM",
    short: "Преврати данные в карточки",
    page: "speakers",
    feature: "Карточки спикеров из массива объектов",
    goal: "Хранить связанные данные в объектах и строить интерфейс на основе массива.",
    exercises: [
      {
        slot: 1,
        title: "Собери имена",
        prompt: "Собери имена через forEach и верни массив.",
        starter:
          "function names(list) {\n  const result = [];\n  return result; // До возврата пройди по list и добавь в result каждое item.name.\n}",
        solution:
          `function names(list) {
  const result = [];
  list.forEach((item) => {
    result.push(item.name);
  });
  return result;
}`,
        tests:
          "equal(JSON.stringify(names([{name:'А'},{name:'Б'}])),JSON.stringify(['А','Б'])); equal(names([]).length,0);",
        hint: "list.forEach(item => result.push(item.name));",
      },
      {
        slot: 4,
        title: "Создай карточку",
        prompt:
          "createCard(person) возвращает новый article с классом speaker-card, h2 и p.",
        starter:
          "function createCard(person) {\n  // Создай article.speaker-card. Добавь h2 с именем и p с ролью. Верни карточку.\n}",
        solution:
          speakerCardSolution,
        tests:
          "const a=createCard({name:'Ада',role:'AI'}),b=createCard({name:'Марк',role:'Web'}); equal(a.tagName,'ARTICLE');ok(a.classList.contains('speaker-card'));equal(a.querySelector('h2').textContent,'Ада');equal(b.querySelector('p').textContent,'Web');ok(a!==b);",
        hint: "Каждый вызов создаёт новый article. Настрой дочерние узлы и верни карточку.",
      },
    ],
    task: "Перенеси createCard из тренажёра. Создай window.renderSpeakers(data), которая очищает #speakers-list и добавляет карточку на каждого спикера через createCard. Вызови функцию с готовыми данными window.novaSpeakers.",
    requirements: [
      "Каждый объект становится отдельной карточкой.",
      "Имена и роли берутся из данных.",
      "Повторный рендер и пустой массив очищают старый список.",
    ],
    starter:
      `// Перенеси из тренажёра createCard(person), которая возвращает готовую карточку.

const list = document.querySelector('#speakers-list');
window.renderSpeakers = function(data) {
  if (list) {
    // Очисти list. Для каждого person создай карточку через createCard и добавь её в list.
  }
};
window.renderSpeakers(window.novaSpeakers);
`,
    solution:
      `${speakerCardSolution}

const list = document.querySelector('#speakers-list');
window.renderSpeakers = function(data) {
  if (list) {
    list.replaceChildren();
    data.forEach((person) => {
      const card = createCard(person);
      list.append(card);
    });
  }
};
window.renderSpeakers(window.novaSpeakers);`,
    hints: [
      "Перенеси createCard(person) из второй задачи тренажёра.",
      "В renderSpeakers сначала вызови list.replaceChildren(), затем data.forEach.",
      "Внутри обхода создай карточку через createCard(person), а затем вызови list.append(card).",
    ],
    tests:
      "test('Три исходных спикера',()=>equal(document.querySelectorAll('.speaker-card').length,3)); test('Новые данные и безопасный текст',()=>{window.renderSpeakers([{name:'<b>Ада</b>',role:'Web'}]); equal(q('.speaker-card h2').textContent,'<b>Ада</b>'); equal(q('.speaker-card p').textContent,'Web'); equal(document.querySelectorAll('.speaker-card').length,1);}); test('Пустой список',()=>{window.renderSpeakers([]); equal(q('#speakers-list').children.length,0);});",
    summary:
      "Теперь карточки зависят от данных: новые спикеры добавляются без копирования HTML.",
  },
  {
    id: 6,
    day: 2,
    title: "Фильтрация данных",
    short: "Собери свою программу",
    page: "program",
    feature: "Три дня программы, фильтр и пустой результат",
    goal: "Отбирать элементы массива по двум условиям и заново отображать результат.",
    exercises: [
      {
        slot: 0,
        title: "Оставь события нужного дня",
        prompt: "Верни только события указанного дня.",
        starter: "function byDay(data, day) {\n  return []; // Верни data.filter с условием item.day === day.\n}",
        solution:
          `function byDay(data, day) {
  return data.filter((item) => item.day === day);
}`,
        tests:
          "equal(byDay([{day:1},{day:2},{day:1}],1).length,2); equal(byDay([],1).length,0);",
        hint: "data.filter(item => item.day === day)",
      },
      {
        slot: 3,
        title: "Добавь выбор направления",
        prompt: "Добавь all только для направления, сохранив ограничение дня.",
        starter: "function selectAll(data,day,track) {\n  return data; // Оставь нужный день. Проверь направление, если track отличается от 'all'.\n}",
        solution:
          `function selectAll(data, day, track) {
  return data.filter((item) =>
    item.day === day && (track === 'all' || item.track === track)
  );
}`,
        tests:
          "const d=[{day:1,track:'AI'},{day:2,track:'AI'},{day:1,track:'Web'}];equal(selectAll(d,1,'all').length,2);equal(selectAll(d,2,'all').length,1);const ai=selectAll(d,1,'AI');equal(ai.length,1);equal(ai[0],d[0]);equal(selectAll(d,2,'Web').length,0);",
        hint: "Объедини правило направления в скобках.",
      },
    ],
    task: "Реализуй window.filterEvents(data, day, track). Свяжи кнопки [data-day] и select#program-track с перерисовкой #events-list. Каждое событие — article.event-row с заголовком. При отсутствии событий покажи #program-empty. Данные находятся в window.novaEvents.",
    requirements: [
      "День и направление фильтруют совместно.",
      "Начальный день — 1, направление — all.",
      "Пустое состояние видно только при отсутствии результатов.",
    ],
    starter:
      "window.filterEvents = function(data, day, track) {\n  return []; // Оставь выбранный день и выбранное направление. 'all' подходит любому направлению.\n};\n// Создай day, track и render. После смены фильтра перерисуй #events-list и обнови #program-empty.\n",
    solution:
      `window.filterEvents = function(data, day, track) {
  return data.filter((item) =>
    item.day === day && (track === 'all' || item.track === track)
  );
};

const list = document.querySelector('#events-list');
if (list) {
  const dayButtons = document.querySelectorAll('[data-day]');
  const trackSelect = document.querySelector('#program-track');
  const emptyMessage = document.querySelector('#program-empty');
  let day = 1;
  let track = 'all';

  function render() {
    list.replaceChildren();
    const visible = window.filterEvents(window.novaEvents, day, track);
    emptyMessage.hidden = visible.length !== 0;
    dayButtons.forEach((button) => {
      button.classList.toggle('active', Number(button.dataset.day) === day);
    });
    visible.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'event-row';
      const time = document.createElement('span');
      time.textContent = item.time;
      const title = document.createElement('h2');
      title.textContent = item.title;
      const badge = document.createElement('span');
      badge.textContent = item.track;
      row.append(time, title, badge);
      list.append(row);
    });
  }

  dayButtons.forEach((button) => {
    button.addEventListener('click', () => {
      day = Number(button.dataset.day);
      render();
    });
  });
  trackSelect.addEventListener('change', () => {
    track = trackSelect.value;
    render();
  });
  render();
}`,
    hints: [
      "Раздели фильтрацию данных и обновление DOM.",
      "Храни day и track. При click/change меняй значение и вызывай render.",
      "emptyMessage.hidden = visible.length !== 0. Для теста выбери день 3 и Robotics, там таких событий нет.",
    ],
    tests:
      "test('Фильтрация разных данных',()=>{equal(window.filterEvents([{day:1,track:'AI'},{day:2,track:'AI'},{day:1,track:'Web'}],1,'AI').length,1); equal(window.filterEvents([],1,'all').length,0);}); test('Начальный день',()=>equal(document.querySelectorAll('.event-row').length,3)); test('Смена дня',()=>{q('[data-day=\"2\"]').click(); equal(document.querySelectorAll('.event-row').length,2); ok(q('#events-list').textContent.includes('Интерфейсы'));}); test('Пустое состояние',()=>{q('[data-day=\"3\"]').click(); q('#program-track').value='Robotics'; q('#program-track').dispatchEvent(new Event('change')); equal(document.querySelectorAll('.event-row').length,0); ok(!q('#program-empty').hidden);}); test('Возврат результатов',()=>{q('#program-track').value='all'; q('#program-track').dispatchEvent(new Event('change')); equal(document.querySelectorAll('.event-row').length,2); ok(q('#program-empty').hidden);});",
    summary:
      "Ты отделил исходные данные от выбранных фильтров и обработал отсутствие результатов.",
  },
  {
    id: 7,
    day: 3,
    title: "Интерактивный калькулятор",
    short: "Считай без сюрпризов",
    page: "tickets",
    feature: "Тарифы, количество и итоговая стоимость",
    goal: "Получать данные из формы, проверять их и пересчитывать интерфейс.",
    exercises: [
      {
        slot: 4,
        title: "Проверь количество",
        prompt:
          "По строковому вводу верни допустимое количество 1–10 или null.",
        starter: "function readCount(raw) {\n  return Number(raw); // Сохрани число. Если оно нецелое или вне диапазона 1–10, верни null.\n}",
        solution:
          `function readCount(raw) {
  const count = Number(raw);
  if (!Number.isInteger(count) || count < 1 || count > 10) {
    return null;
  }
  return count;
}`,
        tests:
          "equal(readCount('2'),2);equal(readCount('10'),10);equal(readCount(''),null);equal(readCount('1.5'),null);equal(readCount('-1'),null);",
        hint: "Преобразование нужно дополнить проверкой правил.",
      },
      {
        slot: 5,
        title: "Считай ввод при изменении",
        prompt:
          "bindQuantity(input,callback) подписывается на input и передаёт callback число из текущего value.",
        starter:
          "function bindQuantity(input,callback) {\n  // В обработчике input преобразуй текущее input.value в число и вызови callback с ним.\n}",
        solution:
          `function bindQuantity(input, callback) {
  input.addEventListener('input', () => {
    const count = Number(input.value);
    callback(count);
  });
}`,
        tests:
          "const input=document.createElement('input');let value=null;bindQuantity(input,n=>value=n);input.value='3';input.dispatchEvent(new Event('input'));equal(value,3);input.value='5';input.dispatchEvent(new Event('input'));equal(value,5);",
        hint: "Читай input.value внутри обработчика, а не только при регистрации.",
      },
    ],
    task: "Создай window.calculateTotal(price,count): цена конечная и неотрицательная, количество целое от 1 до 10; иначе null. Свяжи три [data-price] и #quantity с #ticket-total. По умолчанию цена 2500 и количество 1. При ошибке покажи «Введите от 1 до 10 билетов».",
    requirements: [
      "Все три тарифа пересчитывают итог.",
      "input немедленно меняет стоимость.",
      "Пустое, отрицательное, дробное и слишком большое количество отвергаются.",
    ],
    starter:
      "window.calculateTotal = function(price, count) {\n  // Проверь цену и количество. Верни null при ошибке, иначе верни произведение.\n};\n// Свяжи тариф и #quantity с updateTotal. Покажи в #ticket-total сумму или сообщение об ошибке.\n",
    solution:
      `window.calculateTotal = function(price, count) {
  if (!Number.isFinite(price) || price < 0) {
    return null;
  }
  if (!Number.isInteger(count) || count < 1 || count > 10) {
    return null;
  }
  return price * count;
};

const quantity = document.querySelector('#quantity');
if (quantity) {
  const output = document.querySelector('#ticket-total');
  const tariffButtons = document.querySelectorAll('[data-price]');
  let currentPrice = 2500;

  function updateTotal() {
    const count = Number(quantity.value);
    const total = window.calculateTotal(currentPrice, count);
    if (total === null) {
      output.textContent = 'Введите от 1 до 10 билетов';
    } else {
      output.textContent = total + ' ₽';
    }
  }

  tariffButtons.forEach((selected) => {
    selected.addEventListener('click', () => {
      currentPrice = Number(selected.dataset.price);
      tariffButtons.forEach((button) => {
        button.classList.toggle('active', button === selected);
      });
      updateTotal();
    });
  });
  quantity.addEventListener('input', updateTotal);
  updateTotal();
}`,
    hints: [
      "Сначала проверь функцию на разных числах без DOM.",
      "Храни currentPrice, а count получай при каждом updateTotal через Number(quantity.value).",
      "Для неверных данных возвращай null. Сравни total === null и выведи точный текст ошибки.",
    ],
    tests:
      "test('Расчёт для трёх тарифов',()=>{equal(window.calculateTotal(2500,2),5000); equal(window.calculateTotal(5000,3),15000); equal(window.calculateTotal(12000,10),120000);}); test('Границы',()=>{[0,-1,11,1.5,NaN].forEach(n=>equal(window.calculateTotal(2500,n),null)); equal(window.calculateTotal(-1,1),null); equal(window.calculateTotal(Infinity,1),null); equal(window.calculateTotal(0,1),0);}); test('Выбор тарифа и количество',()=>{q('[data-price=\"5000\"]').click(); q('#quantity').value='2'; q('#quantity').dispatchEvent(new Event('input')); equal(q('#ticket-total').textContent,'10000 ₽');}); test('Ошибочный ввод',()=>{q('#quantity').value=''; q('#quantity').dispatchEvent(new Event('input')); equal(q('#ticket-total').textContent,'Введите от 1 до 10 билетов');});",
    summary:
      "Калькулятор теперь проверяет входные данные, правильно работает с типами и обновляет интерфейс.",
  },
  {
    id: 8,
    day: 3,
    title: "Формы и проверка данных",
    short: "Проверь перед отправкой",
    page: "contacts",
    feature: "Обратная связь с понятными ошибками",
    goal: "Перехватывать submit, проверять поля и сообщать результат пользователю.",
    exercises: [
      {
        slot: 3,
        title: "Найди первую ошибку",
        prompt:
          "Верни первую ошибку обязательных полей: «Имя», затем «Сообщение», иначе пустую строку.",
        starter: "function required(name,message) {\n  return ''; // Перед этой строкой проверь имя, затем сообщение через trim.\n}",
        solution:
          `function required(name, message) {
  if (!name.trim()) return 'Имя';
  if (!message.trim()) return 'Сообщение';
  return '';
}`,
        tests:
          "equal(required(' ',' '),'Имя');equal(required('А',' '),'Сообщение');equal(required('А','Б'),'');",
        hint: "Порядок if определяет приоритет сообщений.",
      },
      {
        slot: 4,
        title: "Обработай отправку формы",
        prompt:
          "bindForm(form,callback) отменяет стандартный submit и вызывает callback ровно один раз на событие.",
        starter:
          "function bindForm(form,callback) {\n  // Подпиши форму на submit. Внутри вызови preventDefault(), затем callback().\n}",
        solution:
          `function bindForm(form, callback) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    callback();
  });
}`,
        tests:
          "const form=document.createElement('form');let calls=0;bindForm(form,()=>calls++);const event=new Event('submit',{cancelable:true});form.dispatchEvent(event);ok(event.defaultPrevented);equal(calls,1);",
        hint: "В начале обработчика вызови event.preventDefault().",
      },
    ],
    task: "Создай window.validateContact(name,email,message): верни «Введите имя», «Введите корректный email» или «Введите сообщение», проверяя именно в этом порядке. При успехе верни пустую строку. На submit #contact-form отменяй перезагрузку, проверяй поля и показывай результат в #form-status. Успех: «Данные проверены. Это учебная форма - сообщение не отправлено.».",
    requirements: [
      "Пробелы не считаются именем или сообщением.",
      "Email проверяется на минимальную структуру.",
      "submit не перезагружает страницу и показывает результат.",
    ],
    starter:
      `${emailFormat}

window.validateContact = function(name, email, message) {
  // Проверь имя, email через hasEmailFormat и сообщение. Верни первую ошибку или ''.
};
// На submit отмени отправку, прочитай поля, вызови validateContact и обнови #form-status.
`,
    solution:
      `${emailFormat}

window.validateContact = function(name, email, message) {
  if (!name.trim()) return 'Введите имя';
  if (!hasEmailFormat(email)) return 'Введите корректный email';
  if (!message.trim()) return 'Введите сообщение';
  return '';
};

const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const message = form.querySelector('[name="message"]').value;
    const error = window.validateContact(name, email, message);
    const status = document.querySelector('#form-status');
    status.textContent = error || 'Данные проверены. Это учебная форма - сообщение не отправлено.';
  });
}`,
    hints: [
      "Проверь name.trim(), затем hasEmailFormat(email), затем message.trim().",
      "Регистрируй submit на form; первой строкой вызови event.preventDefault().",
      "Прочитай email через form.querySelector('[name=\"email\"]').value. Результат проверки покажи в #form-status.",
    ],
    tests:
      "test('Обязательное имя',()=>equal(window.validateContact(' ','a@b.ru','Текст'),'Введите имя')); test('Email',()=>{['','a','a@b','a b@c.ru'].forEach(email=>equal(window.validateContact('А',email,'Текст'),'Введите корректный email'));}); test('Обязательное сообщение',()=>equal(window.validateContact('А','a@b.ru','  '),'Введите сообщение')); test('Верные данные',()=>equal(window.validateContact(' Анна ',' a@b.ru ',' Привет '),'')); test('Submit отменён и показана ошибка',()=>{const e=new Event('submit',{cancelable:true,bubbles:true}); q('#contact-form').dispatchEvent(e); ok(e.defaultPrevented); equal(q('#form-status').textContent,'Введите имя');}); test('Успешная проверка формы',()=>{const f=q('#contact-form'); f.elements.namedItem('name').value='Анна'; f.elements.namedItem('email').value='a@b.ru'; f.elements.namedItem('message').value='Привет'; f.dispatchEvent(new Event('submit',{cancelable:true})); equalText(q('#form-status').textContent,'Данные проверены. Это учебная форма - сообщение не отправлено.');});",
    summary:
      "Ты перехватил отправку формы, проверил данные и честно сообщил, что сообщение не отправляется на сервер.",
  },
  {
    id: 9,
    day: 3,
    title: "Финальный проект и отладка",
    short: "Собери всё вместе",
    page: "about",
    feature: "Информация о фестивале и итоговая проверка",
    goal: "Отладить код, проверить регрессии и скачать независимый сайт.",
    exercises: [
      {
        slot: 3,
        title: "Защити поиск элемента",
        prompt:
          "safeRename(node,text) меняет текст найденного узла и безопасно пропускает null.",
        starter:
          "function safeRename(node,text) {\n  node.textContent = text; // Перенеси эту строку внутрь if (node), чтобы обработать null.\n}",
        solution:
          `function safeRename(node, text) {
  if (node) {
    node.textContent = text;
  }
}`,
        tests:
          "safeRename(null,'NOVA');const node=document.createElement('h1');safeRename(node,'Готово');equal(node.textContent,'Готово');",
        hint: "Проверь существование узла до обращения к свойству.",
      },
      {
        slot: 5,
        title: "Согласуй состояние кнопки",
        prompt:
          "Исправь переключение информации: toggleDetails(button,details) согласует hidden, aria-expanded и текст.",
        starter:
          "function toggleDetails(button,details) {\n  details.hidden = false; // Переключи hidden и обнови подпись и aria-expanded из нового состояния.\n}",
        solution:
          `function toggleDetails(button, details) {
  details.hidden = !details.hidden;
  const isOpen = !details.hidden;
  button.textContent = isOpen ? 'Скрыть' : 'Подробнее';
  button.setAttribute('aria-expanded', String(isOpen));
}`,
        tests:
          "const b=document.createElement('button'),d=document.createElement('div');d.hidden=true;toggleDetails(b,d);equal(d.hidden,false);equal(b.getAttribute('aria-expanded'),'true');equal(b.textContent,'Скрыть');toggleDetails(b,d);equal(d.hidden,true);equal(b.textContent,'Подробнее');",
        hint: "Вычисли новое состояние один раз и отрази его во всех признаках интерфейса.",
      },
    ],
    task: "На странице «О фестивале» кнопка #about-toggle переключает hidden у #about-details, aria-expanded и текст кнопки («Подробнее» / «Скрыть»). Затем добавь этап: платформа прогонит проверки всех ранее добавленных функций. Персонализируй NOVA в свободном редакторе и экспортируй ZIP.",
    requirements: [
      "Дополнительная информация открывается и закрывается.",
      "Текст и aria-expanded совпадают с состоянием.",
      "Предыдущие функции проходят повторную проверку.",
    ],
    starter:
      "const button = document.querySelector('#about-toggle');\nif (button) {\n  // Найди #about-details. В обработчике click переключи hidden, затем обнови подпись и aria-expanded.\n}",
    solution:
      `const button = document.querySelector('#about-toggle');
if (button) {
  const details = document.querySelector('#about-details');
  button.addEventListener('click', () => {
    details.hidden = !details.hidden;
    const isOpen = !details.hidden;
    button.textContent = isOpen ? 'Скрыть' : 'Подробнее';
    button.setAttribute('aria-expanded', String(isOpen));
  });
}`,
    hints: [
      "hidden — boolean-свойство DOM-элемента.",
      "Переключи details.hidden = !details.hidden.",
      "Состояние открытия равно !details.hidden; используй его для aria-expanded и текста.",
    ],
    tests:
      "test('Информация изначально скрыта',()=>ok(q('#about-details').hidden)); test('Открытие и состояние кнопки',()=>{q('#about-toggle').click(); ok(!q('#about-details').hidden); equal(q('#about-toggle').textContent,'Скрыть'); equal(q('#about-toggle').getAttribute('aria-expanded'),'true');}); test('Закрытие',()=>{q('#about-toggle').click(); ok(q('#about-details').hidden); equal(q('#about-toggle').textContent,'Подробнее'); equal(q('#about-toggle').getAttribute('aria-expanded'),'false');});",
    summary:
      "Ты завершил семь страниц NOVA. Проверь проект целиком, скачай архив и сохрани JSON прогресса перед сменой устройства.",
  },
];
