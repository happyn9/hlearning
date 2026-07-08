import api from "./api";

export const getNotifications = () =>
  api.get("/api/notifications");

export const markAsRead = (id) =>
  api.patch(`/api/notifications/${id}/read`);

export const markAllAsRead = () =>
  api.patch("/api/notifications/read-all");

export const subscribePush = (subscription) =>
  api.post("/api/notifications/subscribe", subscription);

export const unsubscribePush = (endpoint) =>
  api.delete("/api/notifications/unsubscribe", { params: { endpoint } });