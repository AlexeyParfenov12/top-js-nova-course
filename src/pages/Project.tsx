import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Check,
  Code2,
  Download,
  Eye,
  GitCompareArrows,
  History,
  RotateCcw,
  Save,
} from "lucide-react";
import { lessons } from "../content/course";
import type { NovaPage } from "../content/types";
import { useProgress } from "../engine/persistence";
import { createProjectZip, download } from "../engine/export";
import { pages, projectReady, referenceCodes } from "../projects/nova";
import { Preview } from "../components/Preview";
import { PageHeading, ProgressBar } from "../components/common";
const noFiles: Record<string, string> = {};
export function Project() {
  const { progress, update } = useProgress();
  const [params] = useSearchParams();
  const [reference, setReference] = useState(params.has("reference"));
  const [compare, setCompare] = useState(false);
  const [page, setPage] = useState<NovaPage>("index");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function exportZip() {
    setBusy(true);
    try {
      download(
        await createProjectZip(
          reference ? referenceCodes : progress.codes,
          reference ? noFiles : progress.files,
        ),
        reference ? "nova-reference.zip" : "my-nova.zip",
      );
      setNotice("ZIP подготовлен: 7 HTML-страниц, стили, данные и JavaScript.");
    } catch {
      setNotice("Не удалось создать архив. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }
  function checkpoint() {
    update((p) => ({
      ...p,
      checkpoints: [
        ...p.checkpoints,
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          stage: p.applied.at(-1) || 1,
          codes: { ...p.codes },
          files: { ...p.files },
        },
      ].slice(-30),
    }));
    setNotice("Контрольная точка сохранена.");
  }
  return (
    <main className="standard-page project-page">
      <div className="project-title-row">
        <PageHeading
          eyebrow="БОЛЬШОЙ ПРОЕКТ / NOVA"
          title="Твой код. Твой фестиваль."
          description="Один сайт, который становится живым с каждым занятием."
        />
        <div className="project-actions">
          <a
            className="button"
            href={import.meta.env.BASE_URL + "nova/index.html"}
            target="_blank"
            rel="noreferrer"
          >
            Эталон отдельно ↗
          </a>
          <Link className="button" to="/editor">
            <Code2 size={16} />
            Открыть редактор
          </Link>
          <button className="primary" disabled={busy} onClick={exportZip}>
            <Download size={16} />
            {busy
              ? "Создаём ZIP…"
              : reference
                ? "Скачать эталон"
                : "Скачать мой NOVA"}
          </button>
        </div>
      </div>
      <div className="project-overview">
        <div>
          <span className="eyebrow">ГОТОВНОСТЬ ПРОЕКТА</span>
          <ProgressBar
            value={projectReady(progress)}
            label={`${progress.applied.length} из 9 этапов`}
          />
        </div>
        <p>
          HTML и CSS уже готовы. Ты последовательно добавляешь JavaScript,
          проверяешь поведение и сохраняешь результат.
        </p>
        <Link className="button" to={`/workspace/${progress.current}`}>
          Текущее задание →
        </Link>
      </div>
      <div className="project-preview-head">
        <div className="tabs">
          <button
            className={!reference ? "active" : ""}
            onClick={() => setReference(false)}
          >
            <Code2 size={15} />
            Мой NOVA
          </button>
          <button
            className={reference ? "active" : ""}
            onClick={() => setReference(true)}
          >
            <Eye size={15} />
            Готовый образец
          </button>
        </div>
        <button
          onClick={() => setCompare(!compare)}
          className={compare ? "active" : ""}
        >
          <GitCompareArrows size={15} />
          Сравнить
        </button>
      </div>
      <div className="page-tabs">
        {pages.map((p) => (
          <button
            className={page === p.id ? "selected" : ""}
            onClick={() => setPage(p.id)}
            key={p.id}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className={"project-previews " + (compare ? "comparing" : "")}>
        <div>
          <div className="browser-chrome">
            <span className="browser-dots">● ● ●</span>
            {reference && !compare ? "Эталон" : "Мой проект"} / {page}.html
            <span>↗ NOVA</span>
          </div>
          <Preview
            page={page}
            codes={
              compare
                ? progress.codes
                : reference
                  ? referenceCodes
                  : progress.codes
            }
            files={
              compare ? progress.files : reference ? noFiles : progress.files
            }
            onNavigate={setPage}
            onError={(s) => setNotice("Ошибка в проекте: " + s)}
          />
        </div>
        {compare && (
          <div>
            <div className="browser-chrome">
              <span className="browser-dots">● ● ●</span>Эталон / {page}.html
              <span>↗ NOVA</span>
            </div>
            <Preview
              page={page}
              codes={referenceCodes}
              files={noFiles}
              onNavigate={setPage}
            />
          </div>
        )}
      </div>
      <p className="subtle-note">
        {reference
          ? "Эталон доступен с первого занятия. В твою версию попадают только добавленные этапы."
          : "В предпросмотре работают только добавленные этапы. Пустые списки появятся после соответствующего этапа."}
      </p>
      <p role="status" className="project-notice">
        {notice}
      </p>
      <div className="project-details">
        <section>
          <div className="section-heading">
            <h2>Карта разработки</h2>
            <span className="muted">9 связанных этапов</span>
          </div>
          <div className="stage-map">
            {lessons.map((l) => (
              <Link
                to={`/workspace/${l.id}`}
                className={progress.applied.includes(l.id) ? "complete" : ""}
                key={l.id}
              >
                <span className="stage-status">
                  {progress.applied.includes(l.id) ? <Check size={17} /> : l.id}
                </span>
                <div>
                  <strong>{l.feature}</strong>
                  <small>
                    {progress.applied.includes(l.id)
                      ? "Добавлено и проверено"
                      : "Впереди"}{" "}
                    · {pages.find((p) => p.id === l.page)?.name}
                  </small>
                </div>
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="history panel">
          <div className="spread">
            <h2>
              <History size={20} />
              Контрольные точки
            </h2>
            <button
              onClick={checkpoint}
              aria-label="Сохранить контрольную точку"
            >
              <Save size={16} />
            </button>
          </div>
          <p>
            Вернись к работающему состоянию перед экспериментами. Хранятся
            последние 30 версий.
          </p>
          {progress.checkpoints.length === 0 ? (
            <p className="muted">
              Первая точка появится после добавления этапа. Можно сохранить её
              вручную.
            </p>
          ) : (
            <div className="checkpoint-list">
              {[...progress.checkpoints].reverse().map((c) => (
                <div key={c.id}>
                  <div>
                    <strong>
                      Этап {c.stage} · {Object.keys(c.codes).length} функций
                    </strong>
                    <small>
                      {new Date(c.date).toLocaleString("ru-RU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  </div>
                  <button
                    aria-label={`Восстановить точку ${c.id}`}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Восстановить эту версию NOVA? Текущие файлы проекта будут заменены. Учебные черновики сохранятся.",
                        )
                      ) {
                        update((p) => ({
                          ...p,
                          codes: { ...c.codes },
                          files: { ...c.files },
                          applied: Object.keys(c.codes)
                            .map(Number)
                            .sort((a, b) => a - b),
                        }));
                        setNotice("Проект восстановлен.");
                      }
                    }}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
