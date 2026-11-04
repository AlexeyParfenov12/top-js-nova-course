import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  FileCode2,
  Folder,
  Lightbulb,
  PanelLeftClose,
  Play,
  RotateCcw,
  Terminal,
  Eye,
  X,
} from "lucide-react";
import { lessons } from "../content/course";
import type { NovaPage, TestResult } from "../content/types";
import { useProgress } from "../engine/persistence";
import { checkInSandbox } from "../engine/execution";
import { pages, projectFiles } from "../projects/nova";
import { CodeEditor } from "../components/CodeEditor";
import { Preview } from "../components/Preview";
export function Workspace({ free = false }: { free?: boolean }) {
  const { id } = useParams();
  const lesson = lessons[(Number(id) || 1) - 1];
  const { progress, update, status } = useProgress();
  const stage = `scripts/stage-${lesson?.id || 1}.js`;
  const [file, setFile] = useState(stage);
  const [openFiles, setOpenFiles] = useState([stage]);
  const [page, setPage] = useState<NovaPage>(lesson?.page || "index");
  const [mode, setMode] = useState("learn");
  const [showInstructions, setShowInstructions] = useState(!free);
  const [showTree, setShowTree] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [ratio, setRatio] = useState(54);
  const [hint, setHint] = useState(0);
  const [consoleTab, setConsoleTab] = useState("tests");
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState("");
  const [notice, setNotice] = useState("");
  const currentCode = progress.drafts[lesson?.id] ?? lesson?.starter ?? "";
  const codeSet = useMemo(
    () =>
      free ? progress.codes : { ...progress.codes, [lesson.id]: currentCode },
    [free, progress.codes, currentCode, lesson?.id],
  );
  const fileSet = useMemo(() => {
    const next = { ...progress.files };
    if (!free) delete next[stage];
    return next;
  }, [progress.files, free, stage]);
  const files = useMemo(
    () => projectFiles(codeSet, fileSet),
    [codeSet, fileSet],
  );
  const signature = JSON.stringify([codeSet, fileSet]);
  const [run, setRun] = useState(() => ({
    codes: codeSet,
    files: fileSet,
    page,
    key: 0,
  }));
  useEffect(() => {
    if (!free && lesson) {
      update((p) => ({ ...p, current: lesson.id }));
      setFile(stage);
      setOpenFiles([stage]);
      setPage(lesson.page);
      setHint(0);
      setNotice("");
      setResults([]);
      setVerified("");
      setRun({
        codes: codeSet,
        files: fileSet,
        page: lesson.page,
        key: Date.now(),
      });
    }
  }, [lesson?.id, free]);
  function open(name: string) {
    setFile(name);
    setOpenFiles((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }
  const readOnly = !free && file !== stage;
  const value = !free && file === stage ? currentCode : files[file] || "";
  function change(code: string) {
    if (code.length > 100000) {
      setNotice("Размер файла ограничен 100 000 символов.");
      return;
    }
    if (free) {
      update((p) => ({ ...p, files: { ...p.files, [file]: code } }));
    } else if (file === stage) {
      update((p) => ({ ...p, drafts: { ...p.drafts, [lesson.id]: code } }));
    }
    setVerified("");
  }
  function execute() {
    setErrors([]);
    setLogs([]);
    setRun({ codes: codeSet, files: fileSet, page, key: Date.now() });
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  async function check() {
    if (busy) return;
    setBusy(true);
    setNotice("Проверяем реальное поведение в отдельном окне…");
    setErrors([]);
    const snapshot = signature;
    const checks: TestResult[] = free
      ? []
      : await checkInSandbox(lesson.page, codeSet, fileSet, lesson.tests);
    if (free) {
      for (const stageId of progress.applied) {
        const l = lessons[stageId - 1];
        const r = await checkInSandbox(l.page, codeSet, fileSet, l.tests);
        checks.push(...r.map((x) => ({ ...x, name: `${stageId}. ${x.name}` })));
      }
    }
    setResults(checks);
    setConsoleTab("tests");
    setShowConsole(true);
    const passed = checks.length > 0 && checks.every((r) => r.passed);
    setVerified(passed ? snapshot : "");
    if (!free)
      update((p) => ({ ...p, results: { ...p.results, [lesson.id]: checks } }));
    setNotice(
      passed
        ? "Все сценарии пройдены. Можно добавить результат в проект."
        : free && checks.length === 0
          ? "Сначала добавьте хотя бы один этап в учебной практике."
          : "Есть ошибки. Изучите результаты и попробуйте подсказку.",
    );
    setBusy(false);
    execute();
  }
  async function apply() {
    if (busy || verified !== signature) return;
    if (
      !progress.applied.includes(lesson.id) &&
      Array.from({ length: lesson.id - 1 }, (_, i) => i + 1).some(
        (n) => !progress.applied.includes(n),
      )
    ) {
      setNotice(
        "Сначала добавьте предыдущие этапы: один проект развивается последовательно.",
      );
      return;
    }
    setBusy(true);
    const checks: TestResult[] = [];
    const stages = Array.from(new Set([...progress.applied, lesson.id])).sort(
      (a, b) => a - b,
    );
    for (const n of stages) {
      const l = lessons[n - 1];
      const r = await checkInSandbox(l.page, codeSet, fileSet, l.tests);
      checks.push(...r.map((x) => ({ ...x, name: `Этап ${n}: ${x.name}` })));
    }
    setResults(checks);
    if (checks.every((r) => r.passed)) {
      update((p) => {
        const codes = { ...p.codes, [lesson.id]: currentCode };
        const nextFiles = { ...p.files };
        delete nextFiles[stage];
        return {
          ...p,
          codes,
          files: nextFiles,
          applied: Array.from(new Set([...p.applied, lesson.id])).sort(
            (a, b) => a - b,
          ),
          current: Math.min(lesson.id + 1, 9),
          checkpoints: [
            ...p.checkpoints,
            {
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              stage: lesson.id,
              codes,
              files: nextFiles,
            },
          ].slice(-30),
        };
      });
      setNotice(
        `Этап ${lesson.id} добавлен в NOVA. Предыдущие функции тоже работают.`,
      );
    } else {
      setVerified("");
      setNotice(
        "Регрессия: новые изменения мешают существующей функции. Проект не изменён.",
      );
    }
    setBusy(false);
  }
  function reset() {
    if (
      !window.confirm(
        free
          ? `Сбросить изменения файла ${file}?`
          : "Сбросить черновик этого задания? Добавленный проект сохранится.",
      )
    )
      return;
    setVerified("");
    setResults([]);
    if (free)
      update((p) => {
        const next = { ...p.files };
        delete next[file];
        return { ...p, files: next };
      });
    else
      update((p) => ({
        ...p,
        drafts: { ...p.drafts, [lesson.id]: lesson.starter },
      }));
  }
  if (!lesson)
    return (
      <main className="standard-page">
        <h1>Задание не найдено</h1>
        <Link to="/curriculum">К программе</Link>
      </main>
    );
  return (
    <main className={"workspace " + (mode === "dev" ? "development" : "")}>
      <div className="workspace-heading">
        <div>
          <Link
            className="text-link small"
            to={free ? "/project" : `/lesson/${lesson.id}`}
          >
            <ArrowLeft size={14} />
            {free
              ? "Мой проект NOVA"
              : `День ${lesson.day} / Пара ${lesson.id}`}
          </Link>
          <h1>{free ? "Редактор проекта NOVA" : lesson.feature}</h1>
        </div>
        <div className="mode-switch">
          <button
            className={mode === "learn" ? "active" : ""}
            onClick={() => {
              setMode("learn");
              setShowInstructions(!free);
            }}
          >
            Обучение
          </button>
          <button
            className={mode === "dev" ? "active" : ""}
            onClick={() => {
              setMode("dev");
              setShowInstructions(false);
            }}
          >
            Разработка
          </button>
        </div>
      </div>
      <div className="workspace-toolbar">
        <div>
          <a
            className="button nova-site-button"
            href={import.meta.env.BASE_URL + "nova/index.html"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть сайт NOVA ↗
          </a>
          <button
            title="Условие задания"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <PanelLeftClose size={16} />
            Условие
          </button>
          <button title="Дерево файлов" onClick={() => setShowTree(!showTree)}>
            <Folder size={16} />
            Файлы
          </button>
          <button onClick={() => setShowPreview(!showPreview)}>
            <Eye size={16} />
            Сайт
          </button>
          <button onClick={() => setShowConsole(!showConsole)}>
            <Terminal size={16} />
            Вывод
          </button>
        </div>
        <div>
          <button onClick={reset} disabled={busy}>
            <RotateCcw size={15} />
            Сбросить
          </button>
          <button onClick={execute} disabled={busy}>
            <Play size={15} />
            Запустить
          </button>
          <button className="primary" disabled={busy} onClick={check}>
            <CheckCheck size={16} />
            {busy
              ? "Проверяем…"
              : free
                ? "Проверить проект"
                : "Проверить решение"}
          </button>
        </div>
      </div>
      <div className="workspace-body">
        {showInstructions && (
          <aside className="instructions">
            <p className="eyebrow">
              {free ? "СВОБОДНАЯ РАБОТА" : "ЗАДАНИЕ " + lesson.id + " / 9"}
            </p>
            <h2>{free ? "Твой NOVA" : lesson.title}</h2>
            <p>
              {free
                ? "Здесь можно изменять все HTML, CSS и JavaScript-файлы основного проекта. После изменений запусти предпросмотр и проверь регрессии. Сохрани контрольную точку на странице проекта."
                : lesson.task}
            </p>
            {!free && (
              <>
                <h3>Что должно работать</h3>
                <ol>
                  {lesson.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ol>
                <div className="hint-box">
                  <button
                    onClick={() => setHint((n) => Math.min(n + 1, 3))}
                    disabled={hint === 3}
                  >
                    <Lightbulb size={16} />
                    Подсказка {Math.min(hint + 1, 3)}/3
                  </button>
                  {lesson.hints.slice(0, hint).map((h, i) => (
                    <p key={i}>
                      <b>{i + 1}.</b> {h}
                    </p>
                  ))}
                </div>
                <details className="solution" key={lesson.id}>
                  <summary>Показать эталонное решение</summary>
                  <p>
                    Сначала попробуй решить самостоятельно. Эталон можно
                    прочитать или загрузить в черновик.
                  </p>
                  <pre>{lesson.solution}</pre>
                  <button
                    onClick={() => {
                      update((p) => ({
                        ...p,
                        drafts: { ...p.drafts, [lesson.id]: lesson.solution },
                      }));
                      setVerified("");
                      open(stage);
                    }}
                  >
                    Загрузить в редактор
                  </button>
                </details>
                <Link className="text-link" to={`/lesson/${lesson.id}`}>
                  Вернуться к теории <ChevronRight size={14} />
                </Link>
                {verified === signature && (
                  <button
                    className="primary apply-button"
                    onClick={apply}
                    disabled={busy}
                  >
                    <Check size={16} />
                    Добавить в мой проект
                  </button>
                )}
                {progress.applied.includes(lesson.id) && (
                  <div className="success">
                    <Check size={17} />
                    Этап добавлен <Link to="/project">Посмотреть ↗</Link>
                  </div>
                )}
              </>
            )}
          </aside>
        )}
        <div className="work-main">
          <div className="split-controls">
            {showPreview && (
              <label>
                Редактор{" "}
                <input
                  aria-label="Ширина редактора"
                  type="range"
                  min="35"
                  max="75"
                  value={ratio}
                  onChange={(e) => setRatio(Number(e.target.value))}
                />{" "}
                Предпросмотр
              </label>
            )}
            <span className="muted small">
              {readOnly ? "Файл доступен для чтения" : status}
            </span>
          </div>
          <div className="code-preview">
            <div
              className="editor-pane"
              style={{ width: showPreview ? ratio + "%" : "100%" }}
            >
              {showTree && (
                <div className="file-tree">
                  <p>NOVA</p>
                  {pages.map((p) => (
                    <button
                      key={p.id}
                      className={file === p.id + ".html" ? "active" : ""}
                      onClick={() => open(p.id + ".html")}
                    >
                      <FileCode2 size={12} />
                      {p.id}.html
                    </button>
                  ))}
                  <button
                    className={file === "styles.css" ? "active" : ""}
                    onClick={() => open("styles.css")}
                  >
                    <span className="css-color">#</span>styles.css
                  </button>
                  <button onClick={() => open("data.js")}>
                    <span className="js-color">JS</span>data.js
                  </button>
                  <p>⌄ scripts</p>
                  {lessons.map((l) => (
                    <button
                      className={
                        file === `scripts/stage-${l.id}.js` ? "active" : ""
                      }
                      onClick={() => open(`scripts/stage-${l.id}.js`)}
                      key={l.id}
                    >
                      <span className="js-color">JS</span>stage-{l.id}.js
                    </button>
                  ))}
                </div>
              )}
              <div className="editor-column">
                <div className="file-tabs">
                  {openFiles.map((name) => (
                    <div className={name === file ? "active" : ""} key={name}>
                      <button onClick={() => setFile(name)}>
                        <span className="js-color">
                          {name.endsWith(".js") ? "JS" : "⌘"}
                        </span>
                        {name.split("/").pop()}
                      </button>
                      {openFiles.length > 1 && (
                        <button
                          aria-label={`Закрыть ${name}`}
                          onClick={() => {
                            const next = openFiles.filter((f) => f !== name);
                            setOpenFiles(next);
                            if (file === name) setFile(next[0]);
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="editor-container">
                  <CodeEditor
                    file={(free ? "project/" : `lesson-${lesson.id}/`) + file}
                    value={value}
                    readOnly={readOnly || busy}
                    onChange={change}
                  />
                </div>
                <div className="editor-status">
                  <span>
                    {readOnly ? "Только чтение" : "JavaScript / NOVA"}
                  </span>
                  <span>UTF-8 · LF · Ctrl+Enter</span>
                </div>
              </div>
            </div>
            {showPreview && (
              <div
                className="preview-pane"
                style={{ width: 100 - ratio + "%" }}
              >
                <div className="preview-toolbar">
                  <Eye size={14} />
                  <select
                    aria-label="Страница предпросмотра"
                    value={page}
                    onChange={(e) => {
                      const next = e.target.value as NovaPage;
                      setPage(next);
                      setRun({
                        codes: codeSet,
                        files: fileSet,
                        page: next,
                        key: Date.now(),
                      });
                    }}
                  >
                    {pages.map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <span className="preview-local">nova.local</span>
                </div>
                <Preview
                  key={run.key}
                  page={run.page}
                  codes={run.codes}
                  files={run.files}
                  onLog={(s) => setLogs((x) => [...x, s].slice(-100))}
                  onError={(s) => setErrors((x) => [...x, s].slice(-30))}
                  onNavigate={(next) => {
                    setPage(next);
                    setRun({ ...run, page: next, key: Date.now() });
                  }}
                />
              </div>
            )}
          </div>
          {showConsole && (
            <section className="console-panel">
              <div className="console-tabs">
                {[
                  ["tests", "Тесты", results.length],
                  ["console", "Консоль", logs.length],
                  ["errors", "Ошибки", errors.length],
                ].map(([key, label, count]) => (
                  <button
                    className={consoleTab === key ? "active" : ""}
                    onClick={() => setConsoleTab(String(key))}
                    key={key}
                  >
                    {label}
                    <span className="count">{count}</span>
                  </button>
                ))}
              </div>
              <div className="console-content" aria-live="polite">
                {consoleTab === "tests" ? (
                  results.length ? (
                    results.map((r, i) => (
                      <div
                        key={i}
                        className={
                          "test-result " + (r.passed ? "passed" : "failed")
                        }
                      >
                        {r.passed ? (
                          <Check size={15} />
                        ) : (
                          <AlertCircle size={15} />
                        )}
                        <span>
                          {r.name}
                          {r.detail && <small>{r.detail}</small>}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="muted">
                      Нажми «Проверить решение»: тесты проверят события, DOM и
                      граничные значения.
                    </p>
                  )
                ) : consoleTab === "console" ? (
                  logs.length ? (
                    logs.map((line, i) => (
                      <div className="log-line" key={i}>
                        › {line}
                      </div>
                    ))
                  ) : (
                    <p className="muted">Вывод console.log появится здесь.</p>
                  )
                ) : errors.length ? (
                  errors.map((line, i) => (
                    <div className="error-text" key={i}>
                      {line}
                    </div>
                  ))
                ) : (
                  <p className="muted">Ошибок выполнения пока нет.</p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="workspace-bottom" role="status">
        <span>
          {notice || "Черновик сохраняется автоматически. Запуск: Ctrl+Enter."}
        </span>
        {!free && verified === signature && (
          <button className="primary" onClick={apply} disabled={busy}>
            Добавить в мой проект <Check size={14} />
          </button>
        )}
        {!free && progress.applied.includes(lesson.id) && (
          <Link
            className="button"
            to={lesson.id < 9 ? `/lesson/${lesson.id + 1}` : "/project"}
          >
            {lesson.id < 9 ? "Следующее занятие" : "К готовому проекту"}
            <ChevronRight size={15} />
          </Link>
        )}
      </div>
    </main>
  );
}
