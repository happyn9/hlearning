import { useState, useEffect, useCallback, useRef } from "react";

// navigator.onLine dit juste "carte réseau active", pas "internet accessible".
// On vérifie donc réellement en pingant l'API, avec un debounce pour éviter
// le flapping (wifi qui coupe 200ms puis revient).
const PING_URL = "/api/health"; // adapte à un endpoint léger existant, sinon garde un fallback
const PING_INTERVAL = 15000; // re-vérifie toutes les 15s tant qu'on est hors ligne
const PING_TIMEOUT = 5000;

async function checkRealConnectivity() {
  if (!navigator.onLine) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT);

    const res = await fetch(PING_URL, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return res.ok || res.status < 500; // on accepte tant que le serveur répond
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef(null);

  const verify = useCallback(async () => {
    setIsChecking(true);
    const online = await checkRealConnectivity();
    setIsOnline(online);
    setIsChecking(false);
    return online;
  }, []);

  useEffect(() => {
    const handleOnline = () => verify();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Vérification initiale au montage
    verify();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [verify]);

  // Tant qu'on est offline, on re-teste périodiquement en arrière-plan
  useEffect(() => {
    if (isOnline) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(verify, PING_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [isOnline, verify]);

  return { isOnline, isChecking, recheck: verify };
}