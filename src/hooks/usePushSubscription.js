import { useCallback } from "react";
import { subscribePush, unsubscribePush } from "../services/notificationAPI";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function usePushSubscription() {
  const isSupported =
    "serviceWorker" in navigator && "PushManager" in window && VAPID_PUBLIC_KEY;

  const enablePush = useCallback(async () => {
    if (!isSupported) return { status: "unsupported" };

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return { status: "denied" };

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const raw = subscription.toJSON();
    await subscribePush({
      endpoint: raw.endpoint,
      keys: { p256dh: raw.keys.p256dh, auth: raw.keys.auth },
    });

    return { status: "subscribed" };
  }, [isSupported]);

  const disablePush = useCallback(async () => {
    if (!isSupported) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await unsubscribePush(subscription.endpoint);
      await subscription.unsubscribe();
    }
  }, [isSupported]);

  return { isSupported, enablePush, disablePush };
}