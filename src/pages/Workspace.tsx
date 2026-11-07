import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  FileCode2,
  Folder,
  Lightbulb,
  PanelsTopLeft,
  Play,
  RotateCcw,
  Terminal,
  Eye,
  X,
} from "lucide-react";
import { lessons } from "../content/course";
import { sessions } from "../content/sessions";
import type { NovaPage, TestResult } from "../content/types";
import { useProgress } from "../engine/persistence";
import { checkInSandbox } from "../engine/execution";
import { pages, projectFiles, referenceCodes } from "../projects/nova";
import { CodeEditor, languageFor } from "../components/CodeEditor";
import { JavaScriptCode } from "../components/JavaScriptCode";
import { Preview } from "../components/Preview";
import { CourseNavigator } from "../components/CourseNavigator";
import "../styles/workspace.css";

function starterTabs(stage: string, page: NovaPage) {
  return [stage, `${page}.html`, "styles.css"];
}

export function Workspace({ free = false }: { free?: boolean }) {
  const { id } = useParams();
  const lesson = lessons[(Number(id) || 1) - 1];
  const { progress, update, status } = useProgress();
  const stage = `scripts/stage-${lesson?.id || 1}.js`;
  const [file, setFile] = useState(stage);
  const [openFiles, setOpenFiles] = useState(() =>
    starterTabs(stage, lesson?.page || "index"),
  );
  const [page, setPage] = useState<NovaPage>(lesson?.page || "index");
  const taskDialog = useRef<HTMLDialogElement>(null);
  const [showTree, setShowTree] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [ratio, setRatio] = useState(52);
  const [zoom, setZoom] = useState(80);
  const [hint, setHint] = useState(0);
  const [consoleTab, setConsoleTab] = useState("reference");
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState("");
  const [notice, setNotice] = useState("");
  const lessonId = lesson?.id ?? 1;
  const savedCode = progress.applied.includes(lessonId)
    ? progress.codes[lessonId]
    : undefined;
  const currentCode =
    progress.drafts[lessonId] ?? savedCode ?? lesson?.starter ?? "";
  const starterCodes = useMemo(() => {
    if (free) return {};
    return Object.fromEntries(
      lessons
        .slice(0, lessonId - 1)
        .filter(
          ({ id }) =>
            progress.codes[id] === undefined &&
            progress.files[`scripts/stage-${id}.js`] === undefined,
        )
        .map(({ id }) => [id, referenceCodes[id]]),
    );
  }, [free, lessonId, progress.codes, progress.files]);
  const starterCount = Object.keys(starterCodes).length;
  const comparisonCodes = useMemo(
    () =>
      free
        ? referenceCodes
        : Object.fromEntries(
            lessons
              .slice(0, lessonId)
              .map(({ id }) => [id, referenceCodes[id]]),
          ),
    [free, lessonId],
  );
  const codeSet = useMemo(
    () =>
      free
        ? progress.codes
        : { ...starterCodes, ...progress.codes, [lessonId]: currentCode },
    [free, progress.codes, starterCodes, currentCode, lessonId],
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
      setOpenFiles(starterTabs(stage, lesson.page));
      setPage(lesson.page);
      setHint(0);
      setNotice("");
      setResults([]);
      setVerified("");
      setConsoleTab("reference");
      taskDialog.current?.close();
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
  function navigatePreview(next: NovaPage) {
    setPage(next);
    setRun((previous) => ({ ...previous, page: next, key: previous.key + 1 }));
  }
  const stagesInWorkspace = lessons.filter(
    ({ id }) =>
      id in codeSet ||
      progress.applied.includes(id) ||
      (!free && id < lessonId && `scripts/stage-${id}.js` in fileSet),
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (e.defaultPrevented || busy || taskDialog.current?.open) return;
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
    setNotice("Проверяем работу сайта…");
    setErrors([]);
    const snapshot = signature;
    const checks: TestResult[] = free
      ? []
      : await checkInSandbox(lesson.page, codeSet, fileSet, lesson.tests);
    if (free) {
      for (const l of stagesInWorkspace) {
        const r = await checkInSandbox(l.page, codeSet, fileSet, l.tests);
        checks.push(...r.map((x) => ({ ...x, name: `${l.id}. ${x.name}` })));
      }
    }
    setResults(checks);
    setConsoleTab("tests");
    setShowConsole(true);
    setShowPreview(true);
    const passed = checks.length > 0 && checks.every((r) => r.passed);
    setVerified(passed ? snapshot : "");
    if (!free)
      update((p) => ({ ...p, results: { ...p.results, [lesson.id]: checks } }));
    setNotice(
      passed
        ? free
          ? "Все сценарии пройдены."
          : "Все сценарии пройдены. Можно добавить результат в проект."
        : free && checks.length === 0
          ? "Сначала добавьте хотя бы один этап в учебной практике."
          : "Есть ошибки. Изучите результаты и попробуйте подсказку.",
    );
    setBusy(false);
    execute();
  }
  async function apply() {
    if (busy || verified !== signature) return;
    setBusy(true);
    const checks: TestResult[] = [];
    for (const l of stagesInWorkspace) {
      const r = await checkInSandbox(l.page, codeSet, fileSet, l.tests);
      checks.push(...r.map((x) => ({ ...x, name: `Этап ${l.id}: ${x.name}` })));
    }
    setResults(checks);
    if (checks.every((r) => r.passed)) {
      update((p) => {
        const codes = { ...starterCodes, ...p.codes, [lesson.id]: currentCode };
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
  const showRightPane = showPreview || showConsole;
  const fileLanguage = languageFor(file);
  return (
    <main className="workspace">
      <header className="workspace-heading">
        <div>
          <Link
            className="workspace-back"
            to={free ? "/project" : `/lesson/${lesson.id}`}
          >
            <ArrowLeft size={14} />
            {free
              ? "Мой проект"
              : `День ${lesson.day} · Задание ${lesson.id} из ${lessons.length}`}
          </Link>
          <div className="workspace-title">
            <h1>{free ? "Редактор проекта NOVA" : lesson.feature}</h1>
            {!free && progress.applied.includes(lesson.id) && (
              <span className="stage-added">
                <Check size={14} /> Этап добавлен
              </span>
            )}
          </div>
        </div>
        <div className="workspace-tools">
          {!free && <CourseNavigator lessonId={lesson.id} />}
          <button
            className="task-trigger"
            aria-haspopup="dialog"
            onClick={() => taskDialog.current?.showModal()}
          >
            <BookOpen size={17} />
            {free ? "Как работать" : "Условие задания"}
          </button>
          <button
            aria-pressed={showPreview}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye size={17} /> <span>Предпросмотр</span>
          </button>
          <button
            aria-pressed={showConsole}
            onClick={() => setShowConsole(!showConsole)}
          >
            <PanelsTopLeft size={16} /> <span>Сравнение и вывод</span>
          </button>
        </div>
      </header>
      <dialog
        ref={taskDialog}
        className="task-dialog"
        aria-labelledby="task-dialog-title"
      >
        <div className="task-dialog-heading">
          <div>
            <p>
              {free
                ? "ПРОЕКТ NOVA"
                : `ПРАКТИКА NOVA · ЗАДАНИЕ ${lesson.id} ИЗ ${lessons.length}`}
            </p>
            <h2 id="task-dialog-title">
              {free ? "Как работать с проектом" : lesson.title}
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Закрыть условие"
            onClick={() => taskDialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <div className="task-dialog-content">
          <p>
            {free
              ? "Здесь можно изменять HTML, CSS и JavaScript проекта. Запускай предпросмотр, проверяй работу сайта и сохраняй контрольные точки на странице проекта."
              : lesson.task}
          </p>
          {!free && (
            <>
              {lesson.id > 1 && (
                <p className="starter-note">
                  {starterCount > 0
                    ? "В редакторе уже есть код предыдущих этапов. Там, где своего кода пока нет, подставлена готовая основа."
                    : "В редакторе уже есть код предыдущих этапов из твоего проекта."}
                </p>
              )}
              <h3>Что должно работать</h3>
              <ol>
                {lesson.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ol>
              <details className="task-disclosure" key={`plan-${lesson.id}`}>
                <summary>План работы</summary>
                <ol>
                  {sessions[lesson.id].practice.map((milestone) => (
                    <li key={milestone}>{milestone}</li>
                  ))}
                </ol>
              </details>
              <div className="task-hints">
                <button
                  onClick={() =>
                    setHint((n) => Math.min(n + 1, lesson.hints.length))
                  }
                  disabled={hint === lesson.hints.length}
                >
                  <Lightbulb size={16} /> Подсказка{" "}
                  {Math.min(hint + 1, lesson.hints.length)}/
                  {lesson.hints.length}
                </button>
                {lesson.hints.slice(0, hint).map((text, i) => (
                  <p key={text}>
                    <b>{i + 1}.</b> {text}
                  </p>
                ))}
              </div>
              <details
                className="task-disclosure"
                key={`solution-${lesson.id}`}
              >
                <summary>Показать эталонное решение</summary>
                <p>
                  Можно прочитать решение или загрузить его в черновик текущего
                  задания.
                </p>
                <pre>
                  <JavaScriptCode code={lesson.solution} />
                </pre>
                <button
                  disabled={busy}
                  onClick={() => {
                    update((p) => ({
                      ...p,
                      drafts: { ...p.drafts, [lesson.id]: lesson.solution },
                    }));
                    setVerified("");
                    setResults([]);
                    open(stage);
                    taskDialog.current?.close();
                  }}
                >
                  Загрузить в редактор
                </button>
              </details>
            </>
          )}
        </div>
        <div className="task-dialog-footer">
          {!free && (
            <Link className="workspace-back" to={`/lesson/${lesson.id}`}>
              К теории <ChevronRight size={15} />
            </Link>
          )}
          <button
            className="primary"
            onClick={() => taskDialog.current?.close()}
          >
            К редактору
          </button>
        </div>
      </dialog>
      <div className="work-main">
        <div className="code-preview">
          <section
            aria-label="Файлы и код"
            className="editor-pane"
            style={{ width: showRightPane ? ratio + "%" : "100%" }}
          >
            <div className="editor-column">
              <div className="editor-file-bar">
                <button
                  className="icon-button"
                  aria-label="Файлы"
                  title="Дерево файлов"
                  aria-pressed={showTree}
                  onClick={() => setShowTree(!showTree)}
                >
                  <Folder size={17} />
                </button>
                <div className="file-tabs" aria-label="Открытые файлы">
                  {openFiles.map((name) => (
                    <div className={name === file ? "active" : ""} key={name}>
                      <button
                        aria-pressed={name === file}
                        onClick={() => setFile(name)}
                      >
                        <span
                          className="file-type"
                          data-type={languageFor(name)}
                          aria-hidden="true"
                        >
                          {name.endsWith(".js")
                            ? "JS"
                            : name.endsWith(".css")
                              ? "#"
                              : "<>"}
                        </span>
                        {name.split("/").pop()}
                      </button>
                      {openFiles.length > 1 && (
                        <button
                          className="close-file"
                          aria-label={`Закрыть ${name}`}
                          onClick={() => {
                            const next = openFiles.filter((f) => f !== name);
                            setOpenFiles(next);
                            if (file === name) setFile(next[0]);
                          }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {showRightPane && (
                  <label className="split-control" title="Ширина редактора">
                    <ArrowLeftRight size={15} aria-hidden="true" />
                    <input
                      aria-label="Ширина редактора"
                      type="range"
                      min="35"
                      max="70"
                      value={ratio}
                      onChange={(event) => setRatio(Number(event.target.value))}
                    />
                  </label>
                )}
              </div>
              <div className="editor-content">
                {showTree && (
                  <div className="file-tree">
                    <p>ФАЙЛЫ NOVA</p>
                    {[
                      ...pages.map((p) => p.id + ".html"),
                      "styles.css",
                      "data.js",
                    ].map((name) => (
                      <button
                        key={name}
                        aria-pressed={file === name}
                        onClick={() => open(name)}
                      >
                        <FileCode2 size={14} />
                        {name}
                      </button>
                    ))}
                    <p>SCRIPTS</p>
                    {lessons.map((l) => {
                      const name = `scripts/stage-${l.id}.js`;
                      return (
                        <button
                          key={name}
                          aria-pressed={file === name}
                          onClick={() => open(name)}
                        >
                          <span
                            className="file-type"
                            data-type="javascript"
                            aria-hidden="true"
                          >
                            JS
                          </span>
                          stage-{l.id}.js
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="editor-container">
                  <CodeEditor
                    file={(free ? "project/" : `lesson-${lesson.id}/`) + file}
                    value={value}
                    readOnly={readOnly || busy}
                    onChange={change}
                    onSizeLimit={() =>
                      setNotice("Размер файла ограничен 100 000 символов.")
                    }
                  />
                </div>
              </div>
              <div className="editor-status">
                <span>{readOnly ? "Только чтение" : status}</span>
                <span>
                  {fileLanguage.toUpperCase()}
                  {!readOnly && " · Ctrl+Пробел — подсказки"}
                  {" · Ctrl+Enter"}
                </span>
              </div>
            </div>
          </section>
          {showRightPane && (
            <section
              aria-label="Предпросмотр и сравнение"
              className="preview-pane"
              style={
                {
                  width: 100 - ratio + "%",
                  "--preview-scale": zoom / 100,
                } as CSSProperties
              }
            >
              <div className="preview-toolbar">
                <strong>
                  <Eye size={16} />{" "}
                  {showPreview ? "Твой результат" : "Сравнение и вывод"}
                </strong>
                <select
                  aria-label="Страница предпросмотра"
                  value={page}
                  onChange={(event) => {
                    const next = event.target.value as NovaPage;
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
                <select
                  aria-label="Масштаб предпросмотра и образца"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                >
                  {[60, 80, 100].map((percent) => (
                    <option key={percent} value={percent}>
                      {percent}%
                    </option>
                  ))}
                </select>
                <a
                  className="nova-site-button"
                  href={import.meta.env.BASE_URL + "nova/index.html"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Открыть сайт NOVA ↗
                </a>
              </div>
              {showPreview && (
                <div className="preview-window live-preview">
                  <Preview
                    key={run.key}
                    page={run.page}
                    codes={run.codes}
                    files={run.files}
                    onLog={(s) => setLogs((x) => [...x, s].slice(-100))}
                    onError={(s) => setErrors((x) => [...x, s].slice(-30))}
                    onNavigate={navigatePreview}
                  />
                </div>
              )}
              {showConsole && (
                <section
                  className="console-panel"
                  aria-label="Сравнение и вывод"
                >
                  <div className="console-tabs">
                    {[
                      ["reference", "Образец", null],
                      ["tests", "Проверка", results.length],
                      ["console", "Консоль", logs.length],
                      ["errors", "Ошибки", errors.length],
                    ].map(([key, label, count]) => (
                      <button
                        aria-pressed={consoleTab === key}
                        onClick={() => setConsoleTab(String(key))}
                        key={key}
                      >
                        {label}
                        {typeof count === "number" && count > 0 && (
                          <span className="count">{count}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {consoleTab === "reference" ? (
                    <div className="preview-window">
                      <Preview
                        title="Образец NOVA"
                        page={run.page}
                        codes={comparisonCodes}
                        onNavigate={navigatePreview}
                      />
                    </div>
                  ) : (
                    <div className="console-content" aria-live="polite">
                      {consoleTab === "tests" ? (
                        results.length ? (
                          results.map((r, i) => (
                            <div
                              key={i}
                              className={`test-result ${r.passed ? "passed" : "failed"}`}
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
                          <p>
                            Нажми «
                            {free ? "Проверить проект" : "Проверить решение"}»,
                            чтобы увидеть результаты.
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
                          <p>Здесь появится вывод console.log.</p>
                        )
                      ) : errors.length ? (
                        errors.map((line, i) => (
                          <div className="error-text" key={i}>
                            {line}
                          </div>
                        ))
                      ) : (
                        <p>Ошибок выполнения пока нет.</p>
                      )}
                    </div>
                  )}
                </section>
              )}
            </section>
          )}
        </div>
        <footer className="workspace-bottom">
          <div className="workspace-actions">
            <button onClick={reset} disabled={busy || (!free && readOnly)}>
              <RotateCcw size={15} /> Сбросить
            </button>
            <button onClick={execute} disabled={busy}>
              <Play size={15} /> Запустить
            </button>
            <button className="primary" disabled={busy} onClick={check}>
              <CheckCheck size={17} />
              {busy
                ? "Проверяем…"
                : free
                  ? "Проверить проект"
                  : "Проверить решение"}
            </button>
          </div>
          <p className="workspace-notice" role="status">
            {notice ||
              (starterCount > 0
                ? "Код предыдущих этапов уже подключён"
                : "Черновик сохраняется автоматически")}
          </p>
          {!free && verified === signature && (
            <button className="primary" onClick={apply} disabled={busy}>
              <Check size={15} /> Добавить в мой проект
            </button>
          )}
          {!free && progress.applied.includes(lesson.id) && (
            <Link
              className="button"
              to={
                lesson.id < lessons.length
                  ? `/lesson/${lesson.id + 1}`
                  : "/project"
              }
            >
              {lesson.id < lessons.length
                ? "Следующее занятие"
                : "К готовому проекту"}
              <ChevronRight size={15} />
            </Link>
          )}
        </footer>
      </div>
    </main>
  );
}
