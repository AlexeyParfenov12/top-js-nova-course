import type { NovaPage, TestResult } from "../content/types";
import { pages, projectFiles, stageCodeLineOffset } from "../projects/nova";
import { guardScript, instrument } from "./instrument";
export interface ExecutionMessage {
  channel: "top-nova";
  token: string;
  type: "result" | "log" | "error" | "navigate" | "ready";
  payload: unknown;
}

class ScriptBuildError extends Error {
  readonly location?: { line: number; column: number };

  readonly detail: string;

  constructor(readonly file: string, cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    super(`${file}: ${message}`);
    this.detail = message.replace(/\s*\(\d+:\d+\)$/, "");
    if (cause instanceof SyntaxError && "loc" in cause) {
      const loc = cause.loc as { line: number; column: number };
      this.location = { line: loc.line, column: loc.column + 1 };
    }
  }
}

export type ScriptLocation = { file: string; line: number; column: number };
export type RawStage = { file: string; code: string };

export function describeBuildError(error: unknown, rawStage?: RawStage) {
  const location = error instanceof ScriptBuildError ? error.location : undefined;
  if (!(error instanceof ScriptBuildError) || !location) {
    return {
      message: error instanceof Error ? error.message : String(error),
      source: null,
    };
  }
  const source: ScriptLocation = { file: error.file, ...location };
  if (source.file === rawStage?.file) {
    const lines = rawStage.code.split(/\r\n?|\n/);
    source.line = Math.max(1, source.line - stageCodeLineOffset);
    if (source.line > lines.length) {
      source.line = lines.length;
      source.column = lines[lines.length - 1].length + 1;
    }
  }
  const detail =
    error.detail === "Unexpected token"
      ? "Проверьте, хватает ли скобок и завершено ли выражение."
      : error.detail;
  return {
    message: `${source.file}, строка ${source.line}: ${detail}`,
    source,
  };
}
export function validMessage(
  event: MessageEvent,
  source: Window | null,
  token: string,
): event is MessageEvent<ExecutionMessage> {
  const d = event.data;
  return (
    event.source === source &&
    event.origin === "null" &&
    d &&
    typeof d === "object" &&
    d.channel === "top-nova" &&
    d.token === token &&
    ["result", "log", "error", "navigate", "ready"].includes(d.type)
  );
}
const script = (text: string) =>
  `<script>${text.replace(/<\/script/gi, "<\\/script")}</script>`;
export function buildPreview(
  page: NovaPage,
  codes: Record<string, string>,
  overrides: Record<string, string>,
  token: string,
  tests?: string,
) {
  const files = projectFiles(codes, overrides);
  const doc = new DOMParser().parseFromString(
    files[`${page}.html`],
    "text/html",
  );
  // All executable content is reconstructed under a network-blocking CSP.
  doc
    .querySelectorAll(
      'script,link[rel="stylesheet"],meta[http-equiv],iframe,object,embed',
    )
    .forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((node) =>
    Array.from(node.attributes)
      .filter((a) => /^on/i.test(a.name))
      .forEach((a) => node.removeAttribute(a.name)),
  );
  // Embed bundled assets as data URLs in the opaque preview; no network permission is needed.
  doc.querySelectorAll("img[src]").forEach((image) => {
    const asset = files[image.getAttribute("src") || ""];
    if (asset?.startsWith("data:image/")) image.setAttribute("src", asset);
  });
  const bridge = `(()=>{const send=(type,payload)=>parent.postMessage({channel:'top-nova',token:${JSON.stringify(token)},type,payload},'*');
 const fmt=x=>{try{return typeof x==='string'?x:JSON.stringify(x)}catch{return String(x)}};
 ['log','warn','info'].forEach(type=>console[type]=(...args)=>send('log',args.map(fmt).join(' ').slice(0,2000)));
 window.addEventListener('error',e=>send('error',String(e.message).slice(0,2000)));
 window.addEventListener('unhandledrejection',e=>send('error',String(e.reason).slice(0,2000)));
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.endsWith('.html')){e.preventDefault();send('navigate',href.slice(0,-5));}else if(!href.startsWith('#')) e.preventDefault();});
 send('ready',null);})();`;
  let scripts = script(guardScript) + script(bridge);
  const scriptNames = [
    "data.js",
    ...Object.keys(files).filter((name) => /^scripts\/stage-\d+\.js$/.test(name)),
  ];
  for (const name of scriptNames) {
    try {
      scripts += script(instrument(files[name]));
    } catch (error) {
      throw new ScriptBuildError(name, error);
    }
  }
  if (tests) {
    scripts += script(`setTimeout(()=>{ __topDeadline=performance.now()+1000;
 const results=[];const q=s=>{const n=document.querySelector(s);if(!n)throw new Error('Не найден элемент '+s);return n;};
 const ok=(x,msg='Ожидаемое поведение не выполнено')=>{if(!x)throw new Error(msg);};
 const equal=(a,b)=>{if(!Object.is(a,b))throw new Error('Ожидалось: '+String(b)+'; получено: '+String(a));};
 const test=(name,fn)=>{try{fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,detail:String(e.message||e).slice(0,1000)});}};
 try{${tests}}catch(e){results.push({name:'Выполнение проверки',passed:false,detail:String(e.message||e)})}
 parent.postMessage({channel:'top-nova',token:${JSON.stringify(token)},type:'result',payload:results},'*');
 },50);`);
  }
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${csp}<style>${files["styles.css"].replace(/<\/style/gi, "<\\/style")}</style></head><body>${doc.body.innerHTML}${scripts}</body></html>`;
}
export function isResults(payload: unknown): payload is TestResult[] {
  return (
    Array.isArray(payload) &&
    payload.length <= 100 &&
    payload.every(
      (r) =>
        r &&
        typeof r.name === "string" &&
        r.name.length < 500 &&
        typeof r.passed === "boolean" &&
        (r.detail === undefined ||
          (typeof r.detail === "string" && r.detail.length <= 2000)),
    )
  );
}
let queue: Promise<unknown> = Promise.resolve();
export function checkInSandbox(
  page: NovaPage,
  codes: Record<string, string>,
  files: Record<string, string>,
  tests: string,
  rawStage?: RawStage,
): Promise<TestResult[]> {
  const run = () =>
    new Promise<TestResult[]>((resolve) => {
      const token = crypto.randomUUID();
      const frame = document.createElement("iframe");
      frame.setAttribute("sandbox", "allow-scripts");
      frame.title = "Изолированная функциональная проверка";
      frame.style.cssText =
        "position:fixed;left:-10000px;width:1024px;height:768px;border:0";
      const errors: string[] = [];
      const finish = (result: TestResult[]) => {
        clearTimeout(timer);
        window.removeEventListener("message", receive);
        frame.remove();
        resolve(result);
      };
      const receive = (e: MessageEvent) => {
        if (!validMessage(e, frame.contentWindow, token)) return;
        if (e.data.type === "error" && typeof e.data.payload === "string")
          errors.push(e.data.payload);
        if (e.data.type === "result" && isResults(e.data.payload))
          finish([
            ...errors.map((detail) => ({
              name: "Ошибка выполнения",
              passed: false,
              detail,
            })),
            ...e.data.payload,
          ]);
      };
      const timer = setTimeout(
        () =>
          finish([
            {
              name: "Время выполнения",
              passed: false,
              detail:
                "Проверка остановлена через 4 секунды. Проверьте циклы и повторите.",
            },
          ]),
        4000,
      );
      window.addEventListener("message", receive);
      try {
        frame.srcdoc = buildPreview(page, codes, files, token, tests);
        document.body.append(frame);
      } catch (e) {
        finish([
          {
            name: "Синтаксис",
            passed: false,
            detail: describeBuildError(e, rawStage).message,
          },
        ]);
      }
    });
  const result = queue.then(run, run);
  queue = result.catch(() => {});
  return result;
}
export const isNovaPage = (value: unknown): value is NovaPage =>
  typeof value === "string" && pages.some((p) => p.id === value);
