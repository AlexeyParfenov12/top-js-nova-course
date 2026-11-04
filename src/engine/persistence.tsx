import { openDB } from "idb";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Progress, TestResult } from "../content/types";
export const emptyProgress = (): Progress => ({
  version: 1,
  current: 1,
  drafts: {},
  exercises: {},
  exerciseDrafts: {},
  applied: [],
  codes: {},
  files: {},
  results: {},
  checkpoints: [],
  sections: {},
});
const db = () =>
  openDB("top-nova-course", 1, {
    upgrade(db) {
      db.createObjectStore("progress");
    },
  });
export async function readProgress() {
  const value = await (await db()).get("progress", "current");
  return value ? validateProgress(value) : emptyProgress();
}
export async function writeProgress(value: Progress) {
  await (await db()).put("progress", value, "current");
}
const record = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
function stringMap(
  x: unknown,
  limit: number,
  keyPattern: RegExp,
): Record<string, string> {
  if (!record(x) || Object.keys(x).length > limit)
    throw new Error("Некорректный набор файлов или ответов.");
  for (const [k, v] of Object.entries(x))
    if (!keyPattern.test(k) || typeof v !== "string" || v.length > 100_000)
      throw new Error(`Некорректные данные: ${k}`);
  return { ...x } as Record<string, string>;
}
function boolMap(x: unknown): Record<string, boolean> {
  if (
    !record(x) ||
    Object.keys(x).length > 100 ||
    Object.entries(x).some(
      ([k, v]) => !/^\d{1,2}-\d{1,2}$/.test(k) || typeof v !== "boolean",
    )
  )
    throw new Error("Некорректные результаты упражнений.");
  return { ...x } as Record<string, boolean>;
}
const codeKey = /^[1-9]$/;
const fileKey =
  /^(?:index|about|tracks|program|speakers|tickets|contacts)\.html$|^(?:styles\.css|data\.js)$|^scripts\/stage-[1-9]\.js$/;
export function validateProgress(value: unknown): Progress {
  if (
    !record(value) ||
    value.version !== 1 ||
    !Number.isInteger(value.current) ||
    Number(value.current) < 1 ||
    Number(value.current) > 9
  )
    throw new Error(
      "Файл прогресса не поддерживается. Ожидается TOP NOVA, версия 1.",
    );
  if (
    !Array.isArray(value.applied) ||
    value.applied.length > 9 ||
    new Set(value.applied).size !== value.applied.length ||
    value.applied.some((n) => !Number.isInteger(n) || n < 1 || n > 9)
  )
    throw new Error("Некорректные этапы.");
  const result: Progress = {
    ...emptyProgress(),
    current: Number(value.current),
    applied: [...value.applied],
    drafts: stringMap(value.drafts, 9, codeKey),
    codes: stringMap(value.codes, 9, codeKey),
    files: stringMap(value.files, 18, fileKey),
    exercises: boolMap(value.exercises),
    exerciseDrafts: stringMap(value.exerciseDrafts, 18, /^[1-9]-[01]$/),
    sections: boolMap(value.sections),
  };
  if (!record(value.results) || Object.keys(value.results).length > 9)
    throw new Error("Некорректные проверки.");
  for (const [k, v] of Object.entries(value.results)) {
    if (
      !codeKey.test(k) ||
      !Array.isArray(v) ||
      v.length > 100 ||
      v.some(
        (r) =>
          !record(r) ||
          typeof r.name !== "string" ||
          r.name.length > 500 ||
          typeof r.passed !== "boolean" ||
          (r.detail !== undefined &&
            (typeof r.detail !== "string" || r.detail.length > 2000)),
      )
    )
      throw new Error("Некорректный результат проверки.");
    result.results[k] = v as TestResult[];
  }
  if (!Array.isArray(value.checkpoints) || value.checkpoints.length > 30)
    throw new Error("Некорректная история.");
  result.checkpoints = value.checkpoints.map((c) => {
    if (
      !record(c) ||
      typeof c.id !== "string" ||
      c.id.length > 100 ||
      typeof c.date !== "string" ||
      !Number.isFinite(Date.parse(c.date)) ||
      !Number.isInteger(c.stage) ||
      Number(c.stage) < 1 ||
      Number(c.stage) > 9
    )
      throw new Error("Некорректная контрольная точка.");
    return {
      id: c.id,
      date: c.date,
      stage: Number(c.stage),
      codes: stringMap(c.codes, 9, codeKey),
      files: stringMap(c.files, 18, fileKey),
    };
  });
  if (result.applied.some((id) => !result.codes[id]))
    throw new Error("Для добавленного этапа отсутствует код.");
  return result;
}
type Context = {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  status: string;
  ready: boolean;
};
const ProgressContext = createContext<Context | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(emptyProgress);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Загружаем прогресс…");
  const chain = useRef(Promise.resolve());
  useEffect(() => {
    let alive = true;
    readProgress()
      .then((p) => {
        if (alive) {
          setProgress(p);
          setReady(true);
        }
      })
      .catch(() => {
        if (alive) {
          setStatus(
            "Не удалось открыть хранилище. Экспортируйте JSON перед закрытием.",
          );
          setReady(true);
        }
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    setStatus("Сохраняем…");
    let current = true;
    chain.current = chain.current
      .catch(() => {})
      .then(() => writeProgress(progress))
      .then(() => {
        if (current) setStatus("Сохранено на устройстве");
      })
      .catch(() => {
        if (current) setStatus("Ошибка сохранения — скачайте JSON");
      });
    return () => {
      current = false;
    };
  }, [progress, ready]);
  return (
    <ProgressContext.Provider
      value={{ progress, update: (fn) => setProgress(fn), status, ready }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("ProgressProvider required");
  return ctx;
}
