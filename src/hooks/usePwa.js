import { useEffect, useState, useCallback } from "react";
import { registerSW } from "virtual:pwa-register";

export function usePwa() {
  const [installEvent, setInstallEvent] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallEvent(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const update = registerSW({
      onNeedRefresh: () => setNeedRefresh(true),
      onOfflineReady: () => setOfflineReady(true),
    });
    setUpdateSW(() => update);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    setCanInstall(false);
    setInstallEvent(null);
    return outcome;
  }, [installEvent]);

  const applyUpdate = useCallback(() => {
    updateSW?.(true);
    setNeedRefresh(false);
  }, [updateSW]);

  return { canInstall, promptInstall, needRefresh, offlineReady, applyUpdate };
}