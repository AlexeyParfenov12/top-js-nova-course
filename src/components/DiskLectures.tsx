import sourceLectures from "../content/diskLectures.json";
import { SyntaxCode } from "./SyntaxCode";

const disk = "https://disk.yandex.ru/d/rT0ZLO9id_jDOQ";
const files = `${import.meta.env.BASE_URL}course-materials/`;

const connections: Record<number, string> = {
  1: "В исходном примере if проверяет класс у кнопки лайка. В NOVA эта же конструкция проверяет результат поиска заголовка. Пример с onclick сравни с addEventListener('click', ...) из нашей практики.",
  2: "В исходном проекте число меняется у счётчика лайков. В NOVA число получается умножением цены на количество. В обоих случаях выводим готовое значение через textContent.",
  3: "Переключатель тем, подсказки и меню работают по одному принципу. JavaScript находит элементы, слушает клик и меняет класс или читает данные из HTML.",
  4: "Исходная подсказка реагирует на клик. В NOVA диалог дополнительно реагирует на клавиатуру. Сравни, какой элемент слушает событие и какая функция выполняется.",
  5: "В исходном проекте append добавляет комментарий. В NOVA createElement и append собирают карточку спикера для каждой записи массива.",
  6: "В исходном проекте по категории скрываются готовые новости. В NOVA отбираем записи из массива по дню и направлению и строим карточки заново.",
  7: "Счётчик символов и ползунок показывают разницу между input и change. Калькулятор NOVA использует input, чтобы обновлять сумму по мере ввода.",
  8: "В исходном проекте отправка добавляет комментарий, а поле пароля реагирует на ввод. В форме NOVA submit запускает проверку и показывает первую ошибку.",
  9: "Кнопка «Наверх» и настройки оформления — дополнительные задачи для повторения событий, условий и состояния интерфейса. Основной маршрут пары заканчивается экспортом NOVA.",
};

export default function DiskLectures({ lessonId }: { lessonId: number }) {
  const lectures = sourceLectures[String(lessonId) as keyof typeof sourceLectures];
  return (
    <>
      <p>{connections[lessonId]}</p>
      <div className="disk-lecture-list">
        {lectures.map((lecture) => (
          <details className="lecture-more disk-lecture" key={lecture.id}>
            <summary>{lecture.title}</summary>
            <div className="disk-lecture-content">
              {lecture.blocks.map((block, index) => {
                if (block.type === "code" && block.text) {
                  return (
                    <pre key={index}>
                      <SyntaxCode code={block.text} language={block.text.trimStart().startsWith("<") ? "html" : "javascript"} />
                    </pre>
                  );
                }
                if (block.type === "image" && block.file) {
                  return <img key={index} src={files + block.file} alt={`Иллюстрация из лекции «${lecture.title}»`} loading="lazy" />;
                }
                if (block.type === "heading") return <h4 key={index}>{block.text}</h4>;
                return <p key={index}>{block.text}</p>;
              })}
              <div className="disk-lecture-links">
                <a href={files + lecture.archive} download={lecture.title + ".zip"}>
                  {lecture.id.endsWith("-00") ? "Скачать конспект Word в ZIP" : "Скачать лекцию и файлы в ZIP"}
                </a>
                <a href={lecture.original} target="_blank" rel="noreferrer">Открыть папку на Яндекс Диске ↗</a>
              </div>
            </div>
          </details>
        ))}
      </div>
      <p className="disk-source-link"><a href={disk} target="_blank" rel="noreferrer">Все пять папок на Яндекс Диске ↗</a></p>
    </>
  );
}
