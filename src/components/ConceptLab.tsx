import { useRef, useState } from "react";
import { FlaskConical, Plus } from "lucide-react";
export function ConceptLab({ id }: { id: number }) {
  const [text, setText] = useState("NOVA");
  const [shown, setShown] = useState("NOVA");
  const [count, setCount] = useState("2");
  const [price, setPrice] = useState("2500");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(["Анна", "Марк"]);
  const [day, setDay] = useState("1");
  const [track, setTrack] = useState("all");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const sum = Number(price) * Number(count);
  const events = [
    { day: "1", track: "AI", title: "Будущее AI" },
    { day: "1", track: "Web", title: "Первый интерфейс" },
    { day: "2", track: "Web", title: "События браузера" },
  ];
  const filtered = events.filter(
    (e) => e.day === day && (track === "all" || e.track === track),
  );
  const valid =
    Number.isInteger(Number(count)) &&
    Number(count) >= 1 &&
    Number(count) <= 10;
  return (
    <section className="concept-lab">
      <h3>
        <FlaskConical size={18} />
        Лаборатория: измени входные данные
      </h3>
      <p className="muted small">
        Управляй примером и наблюдай, как меняются данные и интерфейс.
      </p>
      {id === 1 ? (
        <>
          <label>
            Новый заголовок
            <input
              aria-label="Заголовок лаборатории"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <button onClick={() => setShown(text)}>Изменить textContent</button>
          <div className="lab-output" aria-live="polite">
            {shown}
          </div>
          <pre>{`title.textContent = ${JSON.stringify(text)};`}</pre>
        </>
      ) : id === 2 ? (
        <>
          <div className="lab-inputs">
            <label>
              Цена
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label>
              Количество
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </label>
          </div>
          <div className="lab-output" aria-live="polite">
            {Number.isFinite(sum) ? sum : "Некорректное число"} ₽
          </div>
          <pre>{`Number(${JSON.stringify(price)}) * Number(${JSON.stringify(count)}) = ${sum}\nА без преобразования: ${JSON.stringify(price)} + ${JSON.stringify(count)} = ${JSON.stringify(price + count)}`}</pre>
        </>
      ) : id === 3 ? (
        <>
          <button onClick={() => setOpen(!open)} aria-expanded={open}>
            Переключить меню
          </button>
          <div className="lab-output">
            isOpen → <b>{String(open)}</b>
            <div hidden={!open} className="lab-menu">
              Главная · Программа · Билеты
            </div>
          </div>
          <pre>{`if (${open}) {\n  // ${open ? "эта ветка выполняется" : "эта ветка пропускается"}\n} else {\n  // ${open ? "эта ветка пропускается" : "эта ветка выполняется"}\n}`}</pre>
        </>
      ) : id === 4 ? (
        <>
          <button
            onClick={() => {
              dialog.current?.showModal();
              setMessage("Вызвана функция openDialog()");
            }}
          >
            Открыть dialog
          </button>
          <div className="lab-output" aria-live="polite">
            {message || "Обработчик готов. Функция ещё не вызвана."}
          </div>
          <dialog
            className="lab-dialog"
            ref={dialog}
            onClose={() =>
              setMessage("Событие close: окно закрыто, фокус возвращён.")
            }
          >
            <h2>Функция выполнена</h2>
            <p>Закрой окно кнопкой или клавишей Escape.</p>
            <button onClick={() => dialog.current?.close()}>
              Закрыть пример
            </button>
          </dialog>
        </>
      ) : id === 5 ? (
        <>
          <div className="lab-inputs">
            <label>
              Имя нового спикера
              <input value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <button
              onClick={() => {
                if (text.trim()) setItems((x) => [...x, text.trim()].slice(-8));
              }}
            >
              <Plus size={15} />
              Добавить объект
            </button>
          </div>
          <div className="lab-tags">
            {items.map((name, i) => (
              <span key={i}>{name}</span>
            ))}
          </div>
          <pre>{`data = ${JSON.stringify(
            items.map((name) => ({ name })),
            null,
            2,
          )}\n// DOM: list → ${items.length} элементов article`}</pre>
        </>
      ) : id === 6 ? (
        <>
          <div className="lab-inputs">
            <label>
              День
              <select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="1">День 1</option>
                <option value="2">День 2</option>
                <option value="3">День 3</option>
              </select>
            </label>
            <label>
              Направление
              <select value={track} onChange={(e) => setTrack(e.target.value)}>
                <option value="all">Все</option>
                <option>AI</option>
                <option>Web</option>
              </select>
            </label>
          </div>
          <div className="lab-output" aria-live="polite">
            {filtered.length
              ? filtered.map((e) => (
                  <p key={e.title}>
                    {e.title} · {e.track}
                  </p>
                ))
              : "Ничего не найдено. Это тоже корректный результат."}
          </div>
          <pre>{`data.filter(e => e.day === '${day}' && ('${track}' === 'all' || e.track === '${track}'))\n// Найдено: ${filtered.length}`}</pre>
        </>
      ) : id === 7 ? (
        <>
          <label>
            Количество от 1 до 10
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>
          <div className="lab-output" aria-live="polite">
            {valid
              ? Number(count) * 2500 + " ₽"
              : "Введите целое количество от 1 до 10"}
          </div>
          <pre>{`Number.isInteger(${Number(count)}) && ${Number(count)} >= 1 && ${Number(count)} <= 10\n// valid → ${valid}`}</pre>
        </>
      ) : id === 8 ? (
        <>
          <div className="lab-inputs">
            <label>
              Имя
              <input value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <button
            onClick={() =>
              setMessage(
                !text.trim()
                  ? "Введите имя"
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                    ? "Введите корректный email"
                    : "Данные выглядят корректно. Отправка не выполнялась.",
              )
            }
          >
            Проверить поля
          </button>
          <div className="lab-output" aria-live="polite">
            {message || "Попробуй пробелы в имени или адрес без @."}
          </div>
        </>
      ) : (
        <>
          <label>
            Строка из поля
            <input value={count} onChange={(e) => setCount(e.target.value)} />
          </label>
          <button onClick={() => setOpen(!open)}>
            {open ? "Вернуть ошибку" : "Исправить преобразование"}
          </button>
          <div className="lab-output" aria-live="polite">
            {open ? Number(count) + 1 : count + 1}
          </div>
          <pre>
            {open
              ? `Number(${JSON.stringify(count)}) + 1 // число`
              : `${JSON.stringify(count)} + 1 // склеивание строк — ошибка логики`}
          </pre>
        </>
      )}
    </section>
  );
}
