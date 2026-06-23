// hooks/useTriggerWithProgress.js
import { useState } from "react";

export default function useTriggerWithProgress() {
  const [loadingAction, setLoadingAction] = useState(false);
  const [progress, setProgress] = useState(0);

  const trigger = async (actionCallback) => {
    setLoadingAction(true);
    setProgress(0);

    try {
      // On passe setProgress au callback — c'est lui qui contrôle la barre
      await actionCallback(setProgress);
    } finally {
      setProgress(100);
      setTimeout(() => {
        setLoadingAction(false);
        setProgress(0);
      }, 200);
    }
  };

  return { loadingAction, progress, trigger };
}