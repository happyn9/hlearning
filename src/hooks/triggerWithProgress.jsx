// hooks/useTriggerWithProgress.js
import { useState } from "react";

export default function useTriggerWithProgress() {
  const [loadingAction, setLoadingAction] = useState(false);
  const [progress, setProgress] = useState(0);

  const trigger = (actionCallback, duration = 1200) => {
    setLoadingAction(true);
    setProgress(0);

    const interval = 20;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;

        if (next >= 95) {
          clearInterval(timer);

          // exécute l'action
          actionCallback();

          // termine la barre
          setProgress(100);

          setTimeout(() => {
            setLoadingAction(false);
            setProgress(0);
          }, 200);

          return 100;
        }

        return next;
      });
    }, interval);
  };

  return { loadingAction, progress, trigger };
}
