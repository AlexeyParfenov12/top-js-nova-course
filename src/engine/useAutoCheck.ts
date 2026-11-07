import { useCallback, useEffect, useRef } from "react";

export function useAutoCheck(
  check: (manual: boolean, signal: AbortSignal) => Promise<void>,
) {
  const latestCheck = useRef(check);
  latestCheck.current = check;
  const timer = useRef<number | undefined>(undefined);
  const request = useRef<AbortController | undefined>(undefined);

  const cancel = useCallback(() => {
    window.clearTimeout(timer.current);
    request.current?.abort();
  }, []);

  useEffect(() => cancel, [cancel]);

  function run(manual: boolean) {
    cancel();
    const controller = new AbortController();
    request.current = controller;
    void latestCheck.current(manual, controller.signal);
  }

  return {
    cancel,
    checkNow: () => run(true),
    schedule: () => {
      cancel();
      timer.current = window.setTimeout(() => run(false), 850);
    },
  };
}
