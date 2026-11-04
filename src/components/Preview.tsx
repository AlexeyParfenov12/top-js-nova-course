import { useEffect, useMemo, useRef, useState } from "react";
import type { NovaPage, TestResult } from "../content/types";
import {
  buildPreview,
  isNovaPage,
  isResults,
  validMessage,
} from "../engine/execution";
export function Preview({
  page,
  codes,
  files = {},
  tests,
  onResults,
  onLog,
  onError,
  onNavigate,
  title = "Предпросмотр NOVA",
}: {
  page: NovaPage;
  codes: Record<string, string>;
  files?: Record<string, string>;
  tests?: string;
  onResults?: (r: TestResult[]) => void;
  onLog?: (s: string) => void;
  onError?: (s: string) => void;
  onNavigate?: (p: NovaPage) => void;
  title?: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [buildError, setBuildError] = useState("");
  const token = useMemo(() => crypto.randomUUID(), [page, codes, files, tests]);
  const callbacks = useRef({ onResults, onLog, onError, onNavigate });
  callbacks.current = { onResults, onLog, onError, onNavigate };
  const doc = useMemo(() => {
    try {
      return {
        html: buildPreview(page, codes, files, token, tests),
        error: "",
      };
    } catch (e) {
      return { html: "", error: e instanceof Error ? e.message : String(e) };
    }
  }, [page, codes, files, token, tests]);
  useEffect(() => {
    setBuildError(doc.error);
    if (doc.error) callbacks.current.onError?.(doc.error);
  }, [doc]);
  useEffect(() => {
    let messages = 0;
    const listener = (e: MessageEvent) => {
      if (
        !validMessage(e, frame.current?.contentWindow || null, token) ||
        messages++ > 250
      )
        return;
      const { type, payload } = e.data;
      if (
        type === "log" &&
        typeof payload === "string" &&
        payload.length <= 2000
      )
        callbacks.current.onLog?.(payload);
      if (
        type === "error" &&
        typeof payload === "string" &&
        payload.length <= 2000
      )
        callbacks.current.onError?.(payload);
      if (type === "result" && isResults(payload))
        callbacks.current.onResults?.(payload);
      if (type === "navigate" && isNovaPage(payload))
        callbacks.current.onNavigate?.(payload);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [token]);
  return buildError ? (
    <div className="preview-error">
      <h3>Не удалось запустить код</h3>
      <p>{buildError}</p>
      <p>Исправьте ошибку и нажмите «Запустить».</p>
    </div>
  ) : (
    <iframe
      ref={frame}
      title={title}
      sandbox="allow-scripts"
      srcDoc={doc.html}
      className="nova-frame"
    />
  );
}
