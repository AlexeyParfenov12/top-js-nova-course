import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import {
  useProgress,
  emptyProgress,
  validateProgress,
} from "../engine/persistence";
import { exportProgress } from "../engine/export";
import { PageHeading } from "../components/common";
export function Settings() {
  const { progress, update, status } = useProgress();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  async function load(file: File) {
    try {
      if (file.size > 8_000_000) throw new Error("Файл больше 8 МБ.");
      const next = validateProgress(JSON.parse(await file.text()));
      if (
        window.confirm(
          `Заменить текущий прогресс данными из файла? В файле ${next.applied.length} добавленных этапов. Рекомендуем сначала скачать текущий JSON.`,
        )
      ) {
        update(() => next);
        setMessage("Прогресс импортирован.");
      }
    } catch (e) {
      setMessage(
        "Импорт отклонён: " + (e instanceof Error ? e.message : String(e)),
      );
    }
    if (input.current) input.current.value = "";
  }
  return (
    <main className="standard-page settings">
      <PageHeading
        eyebrow="ДАННЫЕ / ПОМОЩЬ"
        title="Всё остаётся у тебя"
        description="Код и прогресс хранятся в браузере на этом устройстве. Для переноса на другой компьютер скачай JSON."
      />
      <section className="panel">
        <h2>Прогресс обучения</h2>
        <p className="storage-state">{status}</p>
        <div className="settings-actions">
          <button className="primary" onClick={() => exportProgress(progress)}>
            <Download size={17} />
            Экспорт прогресса в JSON
          </button>
          <button onClick={() => input.current?.click()}>
            <Upload size={17} />
            Импорт прогресса
          </button>
          <input
            type="file"
            ref={input}
            accept=".json,application/json"
            hidden
            aria-label="Импорт JSON прогресса"
            onChange={(e) => {
              if (e.target.files?.[0]) void load(e.target.files[0]);
            }}
          />
        </div>
        <p>
          JSON содержит черновики, упражнения, добавленные этапы, файлы проекта,
          результаты проверок и контрольные точки.
        </p>
        <p role="status">{message}</p>
      </section>
      <section className="help-grid">
        {[
          [
            "Как проходит занятие?",
            "Прочитай три раздела теории, запусти пошаговый пример и реши два упражнения. В практике отредактируй JavaScript, запусти и проверь решение. После успеха нажми «Добавить в мой проект».",
          ],
          [
            "Где мой код?",
            "В учебном задании редактируется только файл текущего этапа. Основной проект меняется после проверки. В разделе «Мой проект» есть свободный редактор всех HTML, CSS и JS-файлов.",
          ],
          [
            "Что проверяют тесты?",
            "Реальные клики, значения, элементы DOM и ошибки ввода в изолированном окружении. Это открытые учебные проверки; они помогают учиться и не являются экзаменационной защитой.",
          ],
          [
            "Как получить готовый сайт?",
            "Добавь девять этапов и скачай NOVA в ZIP. В архиве семь страниц, общий CSS и JavaScript. Распакуй и открой index.html или размести файлы на статическом хостинге.",
          ],
        ].map(([title, text]) => (
          <article className="panel" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="panel reset-panel">
        <h3>Начать заново</h3>
        <p>
          Сброс удалит локальный прогресс курса. Скачай JSON для резервной
          копии.
        </p>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Удалить весь прогресс, черновики и контрольные точки этого курса?",
              )
            ) {
              update(() => emptyProgress());
              setMessage("Курс сброшен.");
            }
          }}
        >
          <RotateCcw size={16} />
          Сбросить весь курс
        </button>
      </section>
    </main>
  );
}
