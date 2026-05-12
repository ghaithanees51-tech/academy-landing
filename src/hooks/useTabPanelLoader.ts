import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MIN_MS = 220;

/**
 * Shows a loader after `startTabTransition()` until `panelKey` updates and a short minimum duration passes.
 * Skips running on the first render so URL-driven initial `panelKey` does not flash a loader.
 */
export function useTabPanelLoader(panelKey: string, minMs = DEFAULT_MIN_MS) {
  const [tabContentLoading, setTabContentLoading] = useState(false);
  const awaitingClear = useRef(false);
  const isFirstKeyPass = useRef(true);

  const startTabTransition = useCallback(() => {
    awaitingClear.current = true;
    setTabContentLoading(true);
  }, []);

  useEffect(() => {
    if (isFirstKeyPass.current) {
      isFirstKeyPass.current = false;
      return;
    }
    if (!awaitingClear.current) return;

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;
    const started = performance.now();

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const elapsed = performance.now() - started;
        timeoutId = window.setTimeout(() => {
          if (cancelled) return;
          awaitingClear.current = false;
          setTabContentLoading(false);
        }, Math.max(0, minMs - elapsed));
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [panelKey, minMs]);

  return { tabContentLoading, startTabTransition };
}
