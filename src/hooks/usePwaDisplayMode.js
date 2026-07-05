import { useState, useEffect } from "react";

/**
 * Détecte le mode d'affichage sous lequel l'app tourne actuellement.
 * Utile car iOS retombe toujours sur "standalone" même si le manifest
 * demande "fullscreen" — on ne peut pas se fier au manifest seul.
 *
 * @returns {"fullscreen"|"standalone"|"minimal-ui"|"browser"}
 */
export function usePwaDisplayMode() {
  const getMode = () => {
    if (typeof window === "undefined") return "browser";

    // iOS Safari (ancienne API, toujours utile en 2026 pour Safari)
    if (window.navigator.standalone === true) return "standalone";

    const modes = ["fullscreen", "standalone", "minimal-ui"];
    for (const mode of modes) {
      if (window.matchMedia(`(display-mode: ${mode})`).matches) return mode;
    }
    return "browser";
  };

  const [mode, setMode] = useState(getMode);

  useEffect(() => {
    const modes = ["fullscreen", "standalone", "minimal-ui"];
    const queries = modes.map((m) => window.matchMedia(`(display-mode: ${m})`));

    const handleChange = () => setMode(getMode());
    queries.forEach((mq) => mq.addEventListener("change", handleChange));

    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", handleChange));
    };
  }, []);

  return mode;
}

/** true si l'app tourne installée, peu importe le mode exact */
export function useIsInstalledPwa() {
  const mode = usePwaDisplayMode();
  return mode !== "browser";
}

/** Vibration légère façon "tap" natif — no-op silencieux si non supporté (iOS Safari) */
export function hapticTap() {
  try {
    if (navigator.vibrate) navigator.vibrate(8);
  } catch {
    /* silencieux — pas grave si l'appareil ne supporte pas */
  }
}