import type { Lesson } from "./types";
import { enrichLesson } from "./depth";
export const days = [
  "Основы JavaScript",
  "DOM и работа с данными",
  "Завершение сайта",
];
const foundationLessons: Lesson[] = [
  {
    id: 1,
    day: 1,
    title: "Первые строки JavaScript",
    short: "Дай странице голос",
    page: "index",
    feature: "Заголовок и первая работающая кнопка",
    goal: "Найти элемент страницы, изменить его текст и отреагировать на нажатие пользователя.",
    sections: [
      {
        title: "HTML описывает. JavaScript действует.",
        text: "Браузер читает HTML и строит дерево элементов — DOM. CSS отвечает за внешний вид, а JavaScript меняет состояние страницы. Скрипт выполняется сверху вниз: сначала найдём заголовок, затем запишем в него новый текст. В файлах NOVA атрибут defer откладывает выполнение до разбора HTML. В предпросмотре код вставляется после разметки. В обоих случаях нужные элементы уже существуют.",
        code: "const title = document.querySelector('h1');\ntitle.textContent = 'Привет, NOVA!';",
        note: "querySelector возвращает первый подходящий элемент или null. Проверь селектор и момент запуска, если получил null.",
      },
      {
        title: "Имена и значения",
        text: "const создаёт переменную, которой нельзя присвоить другое значение. let пригодится, когда значение меняется. Имя помогает понять смысл данных. Строки записывают в кавычках, а console.log выводит значение в консоль — это инструмент наблюдения, а не текст на странице.",
        code: "const festival = 'NOVA';\nlet visitors = 0;\nvisitors = visitors + 1;\nconsole.log(festival, visitors);",
        note: "const защищает привязку имени. Свойства найденного DOM-элемента при этом менять можно.",
      },
      {
        title: "Код, который ждёт клика",
        text: "addEventListener регистрирует обработчик. Функция внутри не выполняется сразу: браузер вызовет её при событии click. Скобки после имени функции означают вызов; передача функции без вызова означает «выполни позже».",
        code: "const button = document.querySelector('#hello');\nbutton.addEventListener('click', () => {\n  button.textContent = 'До встречи!';\n});",
        note: "textContent вставляет обычный текст. Для пользовательских строк он безопаснее innerHTML.",
      },
    ],
    demo: {
      code: [
        "const title = 'NOVA';",
        "let guests = 0;",
        "guests = guests + 1;",
        "console.log(title, guests);",
      ],
      states: [
        "Память пуста",
        'title → "NOVA"',
        'title → "NOVA" · guests → 0',
        "guests → 1",
        "Консоль: NOVA 1",
      ],
    },
    exercises: [
      {
        prompt: "Верни название фестиваля из функции festivalName.",
        starter: "function festivalName() {\n  return '';\n}",
        solution: "function festivalName() { return 'NOVA'; }",
        tests: "equal(festivalName(), 'NOVA');",
        hint: "return возвращает значение. Строку NOVA заключи в кавычки.",
      },
      {
        prompt: "Увеличь количество гостей на один и верни результат.",
        starter: "function welcome(count) {\n  // Верни count плюс один\n}",
        solution: "function welcome(count) { return count + 1; }",
        tests: "equal(welcome(0),1); equal(welcome(9),10);",
        hint: "return count + 1;",
      },
    ],
    task: "В index.html уже есть #hero-title, #hello и #greeting. Сделай заголовок «NOVA — будущее начинается здесь». При клике по #hello выведи в #greeting «Увидимся на NOVA!».",
    requirements: [
      "Измени textContent заголовка #hero-title.",
      "Зарегистрируй обработчик click у #hello.",
      "Выведи приветствие только после клика.",
    ],
    starter:
      "// 1. Найди #hero-title и измени его textContent\nconst title = document.querySelector('#hero-title');\ntitle.textContent = 'NOVA';\n\n// 2. Найди #hello и добавь обработчик click\n",
    solution:
      "const title = document.querySelector('#hero-title');\nif (title) {\n  title.textContent = 'NOVA — будущее начинается здесь';\n  document.querySelector('#hello').addEventListener('click', () => {\n    document.querySelector('#greeting').textContent = 'Увидимся на NOVA!';\n  });\n}",
    hints: [
      "Найди все три элемента с помощью document.querySelector.",
      "Изменяй .textContent. Обработчик регистрируется через addEventListener.",
      "button.addEventListener('click', () => { greeting.textContent = 'Увидимся на NOVA!'; });",
    ],
    tests:
      "test('Заголовок изменён',()=>equal(q('#hero-title').textContent,'NOVA — будущее начинается здесь')); test('Приветствие ждёт клика',()=>equal(q('#greeting').textContent,'')); test('Кнопка отвечает на клик',()=>{q('#hello').click(); equal(q('#greeting').textContent,'Увидимся на NOVA!');});",
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
    sections: [
      {
        title: "Число или строка?",
        text: '2500 — число, а "2500" — строка. Оператор + складывает числа, но склеивает строки, если хотя бы один операнд строковый. Поля ввода возвращают строки. Прежде чем считать стоимость, преобразуй их через Number.',
        code: "console.log(2500 + 500); // 3000\nconsole.log('2500' + 500); // '2500500'\nconsole.log(Number('2') * 2500); // 5000",
        note: "Number('') даёт 0, Number('два') — NaN. Проверяй исходный ввод и Number.isFinite.",
      },
      {
        title: "Выражения и порядок действий",
        text: "Умножение и деление выполняются раньше сложения. Скобки явно задают порядок. Не записывай изменяемое значение в нескольких местах: цена и количество — входные данные, итог — производное значение.",
        code: "const price = 2500;\nconst quantity = 3;\nconst total = price * quantity;\nconsole.log(total); // 7500",
        note: "Имена price, quantity и total помогают прочитать формулу без комментария.",
      },
      {
        title: "Одна формула — разные данные",
        text: "Функция получает параметры и возвращает результат. В проекте мы публикуем функцию как window.calculateBase, чтобы другие этапы могли её использовать. window — объект текущего окна браузера. Внутри учебной копии это отдельное окно предпросмотра.",
        code: "window.calculateBase = function(price, count) {\n  return price * count;\n};\nconsole.log(window.calculateBase(2500, 2));",
        note: "return завершает функцию. console.log только показывает значение и не заменяет return.",
      },
    ],
    demo: {
      code: [
        "const price = 2500;",
        "let count = 2;",
        "const total = price * count;",
        "console.log(total);",
      ],
      states: [
        "Память пуста",
        "price → 2500",
        "count → 2",
        "total → 5000",
        "Консоль: 5000",
      ],
    },
    exercises: [
      {
        prompt: "Функция total получает цену и количество. Верни стоимость.",
        starter: "function total(price, count) {\n  return 0;\n}",
        solution: "function total(price, count) { return price * count; }",
        tests:
          "equal(total(2500,2),5000); equal(total(5000,3),15000); equal(total(10,0),0);",
        hint: "Используй умножение price * count.",
      },
      {
        prompt: "Преобразуй две строки в числа и сложи их.",
        starter: "function add(a, b) {\n  return a + b;\n}",
        solution: "function add(a,b) { return Number(a) + Number(b); }",
        tests: "equal(add('2','3'),5); equal(add('10','0'),10);",
        hint: "Number(a) + Number(b)",
      },
    ],
    task: "Создай window.calculateBase(price, count): возвращай произведение цены и количества. Запиши в #base-total результат расчёта двух студенческих билетов по 2500 ₽ — «5000 ₽».",
    requirements: [
      "Функция доступна как window.calculateBase.",
      "Работает для разных цен и количества, включая 0.",
      "В #base-total отображается 5000 ₽.",
    ],
    starter:
      "window.calculateBase = function(price, count) {\n  return 0;\n};\n// Покажи результат в #base-total\n",
    solution:
      "window.calculateBase = function(price, count) {\n  return price * count;\n};\nconst output = document.querySelector('#base-total');\nif (output) output.textContent = window.calculateBase(2500, 2) + ' ₽';",
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
    sections: [
      {
        title: "Программа выбирает путь",
        text: "if выполняет блок, когда условие истинно. else описывает альтернативу. Сравнение === проверяет значение и тип. Boolean — тип с двумя значениями: true и false. Не путай присваивание = со сравнением ===.",
        code: "const age = 17;\nif (age >= 16) {\n  console.log('Добро пожаловать');\n} else {\n  console.log('Приходи с сопровождающим');\n}",
        note: 'Строка "false" не является ложным boolean: непустая строка считается истинной.',
      },
      {
        title: "Класс как состояние",
        text: "classList.add добавляет класс, remove убирает, toggle переключает, contains проверяет наличие. CSS описывает, как выглядит .active или .open. JavaScript меняет состояние, не дублируя стили.",
        code: "const card = document.querySelector('.track');\ncard.classList.add('active');\nconsole.log(card.classList.contains('active'));\ncard.classList.remove('active');",
        note: "toggle возвращает новое состояние: true — класс добавлен, false — удалён.",
      },
      {
        title: "Один выбор из нескольких",
        text: "Чтобы активной оставалась одна карточка, сначала снимем active со всех, затем добавим нажатой. querySelectorAll возвращает коллекцию. forEach вызывает функцию для каждого её элемента; подробно изучим это на пятом занятии.",
        code: "document.querySelectorAll('.track').forEach(card => {\n  card.addEventListener('click', () => {\n    document.querySelectorAll('.track').forEach(item => item.classList.remove('active'));\n    card.classList.add('active');\n  });\n});",
        note: "Состояние меню продублируй в aria-expanded: так его понимают вспомогательные технологии.",
      },
    ],
    demo: {
      code: [
        "let isOpen = false;",
        "isOpen = !isOpen;",
        "if (isOpen) {",
        "  // показать меню",
        "}",
      ],
      states: [
        "Меню закрыто",
        "isOpen → false",
        "isOpen → true",
        "Условие true: входим в блок",
        "Класс .open добавлен",
        "Меню открыто",
      ],
    },
    exercises: [
      {
        prompt: "Доступ разрешён с 16 лет включительно. Верни boolean.",
        starter: "function allowed(age) {\n  return false;\n}",
        solution: "function allowed(age) { return age >= 16; }",
        tests:
          "equal(allowed(15),false); equal(allowed(16),true); equal(allowed(20),true);",
        hint: "Верни результат сравнения age >= 16.",
      },
      {
        prompt: "Верни противоположное логическое состояние.",
        starter: "function toggle(value) {\n  return value;\n}",
        solution: "function toggle(value) { return !value; }",
        tests: "equal(toggle(true),false); equal(toggle(false),true);",
        hint: "Оператор ! инвертирует boolean.",
      },
    ],
    task: "На #menu-toggle переключай класс open у #site-nav и aria-expanded у кнопки. На странице направлений сделай ровно одну .track.active при выборе карточки. Покажи её data-track в #track-choice.",
    requirements: [
      "Меню открывается и закрывается.",
      "aria-expanded соответствует меню.",
      "Выбранное направление имеет active; старое теряет класс.",
    ],
    starter:
      "const menu = document.querySelector('#menu-toggle');\nconst nav = document.querySelector('#site-nav');\n// Добавь переключение меню\n\n// Добавь обработчики карточкам .track\n",
    solution:
      "const menu = document.querySelector('#menu-toggle');\nconst nav = document.querySelector('#site-nav');\nmenu.addEventListener('click', () => {\n  const open = nav.classList.toggle('open');\n  menu.setAttribute('aria-expanded', String(open));\n});\ndocument.querySelectorAll('.track').forEach(card => {\n  card.addEventListener('click', () => {\n    document.querySelectorAll('.track').forEach(item => item.classList.remove('active'));\n    card.classList.add('active');\n    document.querySelector('#track-choice').textContent = card.dataset.track;\n  });\n});",
    hints: [
      "toggle возвращает новое состояние класса.",
      "Сначала убери active со всех карточек, затем добавь выбранной.",
      "card.dataset.track читает HTML-атрибут data-track. menu.setAttribute('aria-expanded', String(open));",
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
    sections: [
      {
        title: "Функция — именованное действие",
        text: "Вынеси повторяющиеся действия в функцию. Параметры — имена входных данных, аргументы — конкретные значения при вызове. Локальные переменные существуют только внутри своего блока. Чистые функции возвращают результат, обработчики часто изменяют страницу.",
        code: "function greet(name) {\n  return 'Привет, ' + name;\n}\nconsole.log(greet('Нова'));",
        note: "greet — ссылка на функцию; greet('Нова') — результат её выполнения.",
      },
      {
        title: "Событие несёт информацию",
        text: "Объект event передаётся обработчику автоматически. У клавиатурного события есть key, у события формы — preventDefault. addEventListener позволяет назначить несколько независимых обработчиков на элемент.",
        code: "document.addEventListener('keydown', event => {\n  console.log(event.key);\n  if (event.key === 'Escape') {\n    console.log('Закрыть окно');\n  }\n});",
        note: "Для Escape используй event.key, а не устаревший keyCode.",
      },
      {
        title: "Доступный диалог",
        text: "Нативный dialog поддерживает модальность и фокус. showModal() открывает окно поверх страницы, close() закрывает и возвращает фокус. У окна должен быть заголовок через aria-labelledby и явная кнопка закрытия. Не вызывай showModal повторно у уже открытого окна.",
        code: "const dialog = document.querySelector('dialog');\nfunction openDialog() {\n  if (!dialog.open) dialog.showModal();\n}\nfunction closeDialog() { dialog.close(); }",
        note: "Escape должен закрывать окно. Проверяй этот сценарий вместе с мышью.",
      },
    ],
    demo: {
      code: [
        "function open() { /* showModal */ }",
        "button.addEventListener('click', open);",
        "// Пользователь нажал кнопку",
        "open();",
      ],
      states: [
        "Функций нет",
        "Функция объявлена, окно закрыто",
        "Обработчик зарегистрирован, окно закрыто",
        "Событие click в очереди",
        "Функция вызвана: окно открыто",
      ],
    },
    exercises: [
      {
        prompt: "Верни приветствие с именем из параметра.",
        starter: "function greet(name) {\n  return '';\n}",
        solution: "function greet(name) { return 'Привет, ' + name; }",
        tests:
          "equal(greet('Анна'),'Привет, Анна'); equal(greet('Марк'),'Привет, Марк');",
        hint: "Объедини строку и name оператором +.",
      },
      {
        prompt: "Функция isCloseKey должна возвращать true только для Escape.",
        starter: "function isCloseKey(key) {\n  return false;\n}",
        solution: "function isCloseKey(key) { return key === 'Escape'; }",
        tests:
          "equal(isCloseKey('Escape'),true); equal(isCloseKey('Enter'),false);",
        hint: "key === 'Escape'",
      },
    ],
    task: "Кнопка #open-modal открывает dialog#festival-modal через showModal(). #close-modal и клавиша Escape закрывают его. Повторное открытие тоже работает.",
    requirements: [
      "Окно открывается по кнопке.",
      "Окно закрывается по кнопке.",
      "Escape закрывает открытое окно.",
    ],
    starter:
      "const dialog = document.querySelector('#festival-modal');\nif (dialog) {\n  // Объяви функции open и close\n  // Подключи три обработчика\n}",
    solution:
      "const dialog = document.querySelector('#festival-modal');\nif (dialog) {\n  const open = () => { if (!dialog.open) dialog.showModal(); };\n  const close = () => dialog.close();\n  document.querySelector('#open-modal').addEventListener('click', open);\n  document.querySelector('#close-modal').addEventListener('click', close);\n  document.addEventListener('keydown', event => {\n    if (event.key === 'Escape') close();\n  });\n}",
    hints: [
      "Найди dialog и обе кнопки.",
      "Передай функцию в addEventListener без вызова.",
      "В keydown проверь event.key === 'Escape', затем вызови dialog.close().",
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
    sections: [
      {
        title: "Один объект — одна сущность",
        text: "Объект объединяет свойства с именами. Для спикера это name, role и track. Доступ через точку удобен, когда имя свойства известно. Массив — упорядоченный список. Индексы начинаются с нуля, length содержит количество элементов.",
        code: "const speaker = { name: 'Анна Вега', track: 'AI' };\nconst speakers = [speaker, { name: 'Марк Лин', track: 'Web' }];\nconsole.log(speakers[0].name);\nconsole.log(speakers.length);",
        note: "Массив и объект — разные структуры: выбирай список для множества сущностей, объект для свойств одной.",
      },
      {
        title: "Действие для каждого элемента",
        text: "forEach передаёт текущий элемент и индекс в функцию. Метод не создаёт новый массив. Для вывода карточек достаточно пройти данные и добавить элементы в контейнер. Не храни отдельно количество спикеров: возьми array.length.",
        code: "const names = ['Анна', 'Марк'];\nnames.forEach((name, index) => {\n  console.log(index, name);\n});",
        note: "forEach выполняется синхронно. Он не ожидает async-функции, но в этой задаче сеть не нужна.",
      },
      {
        title: "Создание безопасного DOM",
        text: "createElement создаёт узел, textContent заполняет текст, append вставляет его в контейнер. Перед повторным рендером очищай контейнер с replaceChildren(), иначе карточки накопятся. Пользовательские данные не вставляй через innerHTML.",
        code: "const list = document.querySelector('#speakers-list');\nlist.replaceChildren();\nconst card = document.createElement('article');\ncard.className = 'speaker-card';\ncard.textContent = 'Анна Вега — AI';\nlist.append(card);",
        note: "Созданный элемент существует в памяти, пока ты не добавишь его в DOM.",
      },
    ],
    demo: {
      code: [
        "const data = ['Анна', 'Марк'];",
        "const card = document.createElement('article');",
        "card.textContent = data[0];",
        "list.append(card);",
      ],
      states: [
        "Контейнер пуст",
        "Массив: 2 имени",
        "В памяти появился article",
        "article содержит текст «Анна»",
        "DOM: list → article «Анна»",
      ],
    },
    exercises: [
      {
        prompt: "Верни имя первого объекта массива.",
        starter: "function firstName(list) {\n  return '';\n}",
        solution:
          "function firstName(list) { return list.length ? list[0].name : ''; }",
        tests:
          "equal(firstName([{name:'Анна'}]),'Анна'); equal(firstName([]),'');",
        hint: "Проверь list.length, затем прочитай list[0].name.",
      },
      {
        prompt: "Собери имена через forEach и верни массив.",
        starter:
          "function names(list) {\n  const result = [];\n  return result;\n}",
        solution:
          "function names(list) { const result=[]; list.forEach(item => result.push(item.name)); return result; }",
        tests:
          "equal(JSON.stringify(names([{name:'А'},{name:'Б'}])),JSON.stringify(['А','Б'])); equal(names([]).length,0);",
        hint: "list.forEach(item => result.push(item.name));",
      },
    ],
    task: "Создай window.renderSpeakers(data). Из каждого {name, role} построй article.speaker-card с h2 и p внутри #speakers-list. Очищай список при повторном вызове. Вызови функцию с window.novaSpeakers — готовыми данными страницы.",
    requirements: [
      "Каждый объект становится отдельной карточкой.",
      "Имена и роли берутся из данных.",
      "Повторный рендер и пустой массив очищают старый список.",
    ],
    starter:
      "window.renderSpeakers = function(data) {\n  // Найди #speakers-list\n  // Очисти контейнер и создай карточки\n};\nif (document.querySelector('#speakers-list')) {\n  window.renderSpeakers(window.novaSpeakers);\n}",
    solution:
      "window.renderSpeakers = function(data) {\n  const list = document.querySelector('#speakers-list');\n  if (!list) return;\n  list.replaceChildren();\n  data.forEach(person => {\n    const card = document.createElement('article');\n    card.className = 'speaker-card';\n    const name = document.createElement('h2');\n    name.textContent = person.name;\n    const role = document.createElement('p');\n    role.textContent = person.role;\n    card.append(name, role);\n    list.append(card);\n  });\n};\nwindow.renderSpeakers(window.novaSpeakers || []);",
    hints: [
      "Сначала list.replaceChildren(), затем data.forEach.",
      "Внутри цикла создай article, h2 и p.",
      "Заполняй textContent и используй card.append(name, role), list.append(card).",
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
    sections: [
      {
        title: "filter сохраняет подходящие элементы",
        text: "filter вызывает предикат для каждого элемента. Если функция вернула true, элемент попадает в новый массив. Исходный массив не меняется. forEach подходит для действия, filter — для отбора.",
        code: "const events = [{day:1, track:'AI'}, {day:2, track:'Web'}];\nconst today = events.filter(event => event.day === 1);\nconsole.log(today.length); // 1",
        note: "filter всегда возвращает массив, в том числе пустой.",
      },
      {
        title: "Два условия одновременно",
        text: "Оператор && требует истинности обоих условий. || допускает хотя бы одно. Для значения all фильтр направления пропускает все записи, но день всё равно должен совпадать. Скобки делают приоритет явным.",
        code: "function selectEvents(data, day, track) {\n  return data.filter(item =>\n    item.day === day && (track === 'all' || item.track === track)\n  );\n}",
        note: "В HTML data-day — строка. Преобразуй её в число перед строгим сравнением.",
      },
      {
        title: "Состояние и отрисовка",
        text: "Храни выбранный день и направление в переменных. Одна render-функция очищает список, получает отфильтрованные данные и рисует карточки. Если массив пуст, покажи понятное сообщение вместо пустой белой области.",
        code: "let day = 1;\nlet track = 'all';\nfunction render() {\n  const items = selectEvents(data, day, track);\n  empty.hidden = items.length > 0;\n}",
        note: "После переключения дня сохраняй выбранное направление: фильтры работают совместно.",
      },
    ],
    demo: {
      code: [
        "const tracks = ['AI', 'Web', 'AI'];",
        "const result = tracks.filter(x => x === 'AI');",
        "console.log(result);",
      ],
      states: [
        "Данных нет",
        "Массив: AI · Web · AI",
        "Проверки: true · false · true",
        "Результат: AI · AI; исходный массив не изменён",
      ],
    },
    exercises: [
      {
        prompt: "Верни только события указанного дня.",
        starter: "function byDay(data, day) {\n  return [];\n}",
        solution:
          "function byDay(data,day) { return data.filter(item => item.day === day); }",
        tests:
          "equal(byDay([{day:1},{day:2},{day:1}],1).length,2); equal(byDay([],1).length,0);",
        hint: "data.filter(item => item.day === day)",
      },
      {
        prompt: "Верни все данные для all, иначе только указанное направление.",
        starter: "function byTrack(data, track) {\n  return data;\n}",
        solution:
          "function byTrack(data,track) { return data.filter(item => track === 'all' || item.track === track); }",
        tests:
          "equal(byTrack([{track:'AI'},{track:'Web'}],'AI').length,1); equal(byTrack([{track:'AI'}],'all').length,1); equal(byTrack([{track:'AI'}],'Web').length,0);",
        hint: "track === 'all' || item.track === track",
      },
    ],
    task: "Реализуй window.filterEvents(data, day, track). Свяжи кнопки [data-day] и select#program-track с перерисовкой #events-list. Каждое событие — article.event-row с заголовком. При отсутствии событий покажи #program-empty. Данные находятся в window.novaEvents.",
    requirements: [
      "День и направление фильтруют совместно.",
      "Начальный день — 1, направление — all.",
      "Пустое состояние видно только при отсутствии результатов.",
    ],
    starter:
      "window.filterEvents = function(data, day, track) {\n  return [];\n};\n// Состояние, render и обработчики\n",
    solution:
      "window.filterEvents = function(data, day, track) {\n  return data.filter(item => item.day === day && (track === 'all' || item.track === track));\n};\nconst list = document.querySelector('#events-list');\nif (list) {\n  let day = 1;\n  let track = 'all';\n  function render() {\n    list.replaceChildren();\n    const items = window.filterEvents(window.novaEvents, day, track);\n    document.querySelector('#program-empty').hidden = items.length > 0;\n    document.querySelectorAll('[data-day]').forEach(btn => {\n      btn.classList.toggle('active', Number(btn.dataset.day) === day);\n    });\n    items.forEach(item => {\n      const row = document.createElement('article');\n      row.className = 'event-row';\n      const time = document.createElement('span');\n      time.textContent = item.time;\n      const title = document.createElement('h2');\n      title.textContent = item.title;\n      const badge = document.createElement('span');\n      badge.textContent = item.track;\n      row.append(time, title, badge);\n      list.append(row);\n    });\n  }\n  document.querySelectorAll('[data-day]').forEach(btn => btn.addEventListener('click', () => { day = Number(btn.dataset.day); render(); }));\n  document.querySelector('#program-track').addEventListener('change', event => { track = event.target.value; render(); });\n  render();\n}",
    hints: [
      "Раздели фильтрацию данных и обновление DOM.",
      "Храни day и track. При click/change меняй значение и вызывай render.",
      "empty.hidden = items.length > 0; для теста выбери день 3 и Robotics — таких событий нет.",
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
    sections: [
      {
        title: "Значение поля — строка",
        text: "Даже input type=number отдаёт value как строку. Number преобразует значение, Number.isInteger проверяет целое число. Проверяй границы: покупатель может удалить число или ввести отрицательное, дробное, слишком большое значение.",
        code: "const raw = document.querySelector('#quantity').value;\nconst count = Number(raw);\nconst valid = Number.isInteger(count) && count >= 1 && count <= 10;",
        note: "Атрибуты min и max помогают пользователю, но не заменяют проверку в JavaScript.",
      },
      {
        title: "Чистая функция расчёта",
        text: "Вынеси правила в calculateTotal. Функция должна возвращать число для допустимых параметров и null для ошибочных. Это проще проверить, чем функцию, смешанную с DOM. Итог нельзя хранить отдельно от цены и количества — его нужно вычислять заново.",
        code: "function calculateTotal(price, count) {\n  if (!Number.isFinite(price) || price < 0) return null;\n  if (!Number.isInteger(count) || count < 1 || count > 10) return null;\n  return price * count;\n}",
        note: "null — явный сигнал «результата нет». Не выводи NaN ₽.",
      },
      {
        title: "События input и change",
        text: "input приходит при каждом изменении текста. change удобно использовать для select и завершённого выбора. Одна update-функция считывает текущее состояние и показывает либо сумму, либо сообщение об ошибке. Кнопки тарифов должны обновить и состояние, и активный стиль.",
        code: "quantity.addEventListener('input', update);\nfunction update() {\n  const sum = calculateTotal(price, Number(quantity.value));\n  output.textContent = sum === null ? 'Проверьте количество' : sum + ' ₽';\n}",
        note: "Проверяй ровно null, потому что 0 тоже бывает корректным числовым результатом.",
      },
    ],
    demo: {
      code: [
        "const raw = '3';",
        "const count = Number(raw);",
        "const valid = Number.isInteger(count) && count >= 1;",
        "const total = valid ? 2500 * count : null;",
      ],
      states: [
        "Поле содержит строку",
        'raw → "3" (string)',
        "count → 3 (number)",
        "valid → true",
        "total → 7500",
      ],
    },
    exercises: [
      {
        prompt: "Верни true только для целого количества от 1 до 10.",
        starter: "function validCount(value) {\n  return false;\n}",
        solution:
          "function validCount(value) { return Number.isInteger(value) && value >= 1 && value <= 10; }",
        tests:
          "equal(validCount(1),true); equal(validCount(10),true); equal(validCount(0),false); equal(validCount(1.5),false); equal(validCount(11),false);",
        hint: "Number.isInteger(value) && value >= 1 && value <= 10",
      },
      {
        prompt: "Преобразуй строку количества и верни стоимость по 2500.",
        starter: "function fromInput(raw) {\n  return 0;\n}",
        solution: "function fromInput(raw) { return Number(raw) * 2500; }",
        tests: "equal(fromInput('2'),5000); equal(fromInput('4'),10000);",
        hint: "Number(raw) * 2500",
      },
    ],
    task: "Создай window.calculateTotal(price,count): цена конечная и неотрицательная, количество целое от 1 до 10; иначе null. Свяжи три [data-price] и #quantity с #ticket-total. По умолчанию цена 2500 и количество 1. При ошибке покажи «Введите от 1 до 10 билетов».",
    requirements: [
      "Все три тарифа пересчитывают итог.",
      "input немедленно меняет стоимость.",
      "Пустое, отрицательное, дробное и слишком большое количество отвергаются.",
    ],
    starter:
      "window.calculateTotal = function(price, count) {\n  // Проверка и расчёт\n};\n// Подключи калькулятор к DOM\n",
    solution:
      "window.calculateTotal = function(price, count) {\n  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(count) || count < 1 || count > 10) return null;\n  return price * count;\n};\nconst quantity = document.querySelector('#quantity');\nif (quantity) {\n  let price = 2500;\n  function update() {\n    const total = window.calculateTotal(price, Number(quantity.value));\n    document.querySelector('#ticket-total').textContent = total === null ? 'Введите от 1 до 10 билетов' : total + ' ₽';\n  }\n  document.querySelectorAll('[data-price]').forEach(btn => btn.addEventListener('click', () => {\n    price = Number(btn.dataset.price);\n    document.querySelectorAll('[data-price]').forEach(item => item.classList.toggle('active', item === btn));\n    update();\n  }));\n  quantity.addEventListener('input', update);\n  update();\n}",
    hints: [
      "Сначала проверь функцию на разных числах без DOM.",
      "Храни price, а count получай при каждом update через Number(quantity.value).",
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
    sections: [
      {
        title: "Форма — единое действие",
        text: "Событие submit приходит на form при кнопке отправки и нажатии Enter. preventDefault отменяет стандартную перезагрузку страницы. Без сервера мы можем проверить данные и показать учебное подтверждение, но не доставить сообщение организаторам.",
        code: "form.addEventListener('submit', event => {\n  event.preventDefault();\n  console.log('Проверяем данные локально');\n});",
        note: "Перехватывай submit формы, а не только click кнопки: это поддерживает клавиатуру.",
      },
      {
        title: "Пробелы — тоже ввод",
        text: "trim удаляет пробелы по краям строки. Имя из одних пробелов нужно отклонить. Для email проверим минимальную структуру: символы до @, домен и точку. Это учебная проверка, она не доказывает существование почтового ящика.",
        code: "const name = input.value.trim();\nif (!name) console.log('Введите имя');\nconst emailLooksValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);",
        note: "Не изменяй оригинальное значение без необходимости: для проверки достаточно очищенной копии.",
      },
      {
        title: "Сообщения помогают исправить ошибку",
        text: "Не показывай только красную рамку. Назови конкретную проблему и помести сообщение в область с aria-live. После исправления заменяй старую ошибку новым результатом. Функция validateContact возвращает пустую строку при успехе или текст первой ошибки.",
        code: "function validateContact(name, email) {\n  if (!name.trim()) return 'Введите имя';\n  if (!email.trim()) return 'Введите email';\n  return '';\n}",
        note: "У формы в проекте novalidate: собственные сообщения должны появляться даже при неверном email.",
      },
    ],
    demo: {
      code: [
        "const rawName = '   ';",
        "const name = rawName.trim();",
        "if (!name) {",
        "  message = 'Введите имя';",
        "}",
      ],
      states: [
        "Форма не проверена",
        "rawName → три пробела",
        "name → пустая строка",
        "!name → true",
        "Сообщение: Введите имя",
        "Отправка отменена",
      ],
    },
    exercises: [
      {
        prompt: "Верни true для непустого после trim имени.",
        starter: "function hasName(name) {\n  return false;\n}",
        solution: "function hasName(name) { return name.trim().length > 0; }",
        tests:
          "equal(hasName('   '),false); equal(hasName(' Анна '),true); equal(hasName(''),false);",
        hint: "name.trim().length > 0",
      },
      {
        prompt:
          "Верни сообщение об ошибке для пустого сообщения; иначе пустую строку.",
        starter: "function checkMessage(text) {\n  return '';\n}",
        solution:
          "function checkMessage(text) { return text.trim() ? '' : 'Введите сообщение'; }",
        tests:
          "equal(checkMessage(' '),'Введите сообщение'); equal(checkMessage('Привет'),'');",
        hint: "Используй if (!text.trim()) return 'Введите сообщение';",
      },
    ],
    task: "Создай window.validateContact(name,email,message): верни «Введите имя», «Введите корректный email» или «Введите сообщение», проверяя именно в этом порядке. При успехе верни пустую строку. На submit #contact-form отменяй перезагрузку, проверяй поля и показывай результат в #form-status. Успех: «Данные проверены. Это учебная форма — сообщение не отправлено.».",
    requirements: [
      "Пробелы не считаются именем или сообщением.",
      "Email проверяется на минимальную структуру.",
      "submit не перезагружает страницу и показывает результат.",
    ],
    starter:
      "window.validateContact = function(name, email, message) {\n  // Верни первую ошибку или пустую строку\n};\n// Обработчик submit\n",
    solution:
      "window.validateContact = function(name, email, message) {\n  if (!name.trim()) return 'Введите имя';\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) return 'Введите корректный email';\n  if (!message.trim()) return 'Введите сообщение';\n  return '';\n};\nconst form = document.querySelector('#contact-form');\nif (form) form.addEventListener('submit', event => {\n  event.preventDefault();\n  const error = window.validateContact(form.elements.namedItem('name').value, form.elements.namedItem('email').value, form.elements.namedItem('message').value);\n  document.querySelector('#form-status').textContent = error || 'Данные проверены. Это учебная форма — сообщение не отправлено.';\n});",
    hints: [
      "Проверь name.trim(), затем email, затем message.trim().",
      "Регистрируй submit на form; первой строкой вызови event.preventDefault().",
      "form.elements.namedItem('email').value; результат функции присвой textContent у #form-status.",
    ],
    tests:
      "test('Обязательное имя',()=>equal(window.validateContact(' ','a@b.ru','Текст'),'Введите имя')); test('Email',()=>{['','a','a@b','a b@c.ru'].forEach(email=>equal(window.validateContact('А',email,'Текст'),'Введите корректный email'));}); test('Обязательное сообщение',()=>equal(window.validateContact('А','a@b.ru','  '),'Введите сообщение')); test('Верные данные',()=>equal(window.validateContact(' Анна ',' a@b.ru ',' Привет '),'')); test('Submit отменён и показана ошибка',()=>{const e=new Event('submit',{cancelable:true,bubbles:true}); q('#contact-form').dispatchEvent(e); ok(e.defaultPrevented); equal(q('#form-status').textContent,'Введите имя');}); test('Успешная проверка формы',()=>{const f=q('#contact-form'); f.elements.namedItem('name').value='Анна'; f.elements.namedItem('email').value='a@b.ru'; f.elements.namedItem('message').value='Привет'; f.dispatchEvent(new Event('submit',{cancelable:true})); equal(q('#form-status').textContent,'Данные проверены. Это учебная форма — сообщение не отправлено.');});",
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
    sections: [
      {
        title: "Ошибка — наблюдение, а не приговор",
        text: "SyntaxError означает, что браузер не смог разобрать программу. ReferenceError — имя не найдено. TypeError часто возникает при обращении к свойству null. Читай первое сообщение, найди строку и воспроизведи проблему на минимальном примере. Не меняй сразу несколько несвязанных мест.",
        code: "const node = document.querySelector('#missing');\nconsole.log(node); // null\n// node.textContent = 'NOVA'; // TypeError\nif (node) node.textContent = 'NOVA';",
        note: "Ошибка в одной функции не исправляется подавлением всех ошибок через пустой catch.",
      },
      {
        title: "Проверь переходы состояния",
        text: "Хороший тест проверяет поведение: открыть и закрыть, выбрать другой тариф, ввести пустое значение, повторно отрисовать список. Проверка регрессии повторяет тесты старых функций после добавления новой. В учебной платформе перед добавлением этапа проверяются все уже добавленные этапы.",
        code: "button.click();\nconsole.assert(!details.hidden, 'Информация видна');\nbutton.click();\nconsole.assert(details.hidden, 'Информация скрыта');",
        note: "Зелёный тест подтверждает конкретный сценарий. Добавляй новые сценарии, когда находишь ошибку.",
      },
      {
        title: "Подготовь проект к жизни отдельно",
        text: "HTML-страницы должны ссылаться на общий styles.css и файлы scripts/stage-N.js. Скрипты подключены с defer и защищены проверкой нужного элемента. Проверь все семь страниц, клавиатуру, узкое окно и архив после распаковки. В свободном редакторе можно изменить HTML и CSS.",
        code: '<link rel="stylesheet" href="styles.css">\n<script src="scripts/stage-1.js" defer></script>',
        note: "Для простой анимации используй CSS и учитывай prefers-reduced-motion. GSAP для этого курса не требуется.",
      },
    ],
    demo: {
      code: [
        "const node = document.querySelector('#missing');",
        "console.log(node);",
        "if (node) { node.textContent = 'NOVA'; }",
        "// Повторяем тесты предыдущих этапов",
      ],
      states: [
        "Отладчик готов",
        "node → null",
        "Консоль: null",
        "Условие false: безопасно пропускаем изменение",
        "Регрессии → проверить 8 предыдущих функций",
      ],
    },
    exercises: [
      {
        prompt: "Исправь функцию: вместо склеивания строк верни сумму чисел.",
        starter: "function fixedSum(a,b) {\n  return String(a) + String(b);\n}",
        solution: "function fixedSum(a,b) { return Number(a) + Number(b); }",
        tests: "equal(fixedSum('2','3'),5); equal(fixedSum(0,7),7);",
        hint: "Используй Number вместо String.",
      },
      {
        prompt: "Верни текст найденного объекта или «Не найдено» для null.",
        starter: "function safeText(node) {\n  return node.textContent;\n}",
        solution:
          "function safeText(node) { return node ? node.textContent : 'Не найдено'; }",
        tests:
          "equal(safeText(null),'Не найдено'); equal(safeText({textContent:'NOVA'}),'NOVA');",
        hint: "Сначала проверь, существует ли node.",
      },
    ],
    task: "На странице «О фестивале» кнопка #about-toggle переключает hidden у #about-details, aria-expanded и текст кнопки («Подробнее» / «Скрыть»). Затем добавь этап: платформа прогонит проверки всех ранее добавленных функций. Персонализируй NOVA в свободном редакторе и экспортируй ZIP.",
    requirements: [
      "Дополнительная информация открывается и закрывается.",
      "Текст и aria-expanded совпадают с состоянием.",
      "Предыдущие функции проходят повторную проверку.",
    ],
    starter:
      "const button = document.querySelector('#about-toggle');\nif (button) {\n  // Переключи hidden, aria-expanded и текст\n}",
    solution:
      "const button = document.querySelector('#about-toggle');\nif (button) {\n  const details = document.querySelector('#about-details');\n  button.addEventListener('click', () => {\n    details.hidden = !details.hidden;\n    button.setAttribute('aria-expanded', String(!details.hidden));\n    button.textContent = details.hidden ? 'Подробнее' : 'Скрыть';\n  });\n}",
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
export const lessons = foundationLessons.map(enrichLesson);
export const courseTotals = {
  sections: lessons.reduce((n, l) => n + l.sections.length, 0),
  exercises: lessons.reduce((n, l) => n + l.exercises.length, 0),
  questions: lessons.reduce((n, l) => n + l.quiz.length, 0),
};
