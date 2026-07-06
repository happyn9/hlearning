import api from "./api";

export const getNotifications = () =>
  api.get("/api/notifications").then((res) => res.data);

export const markAsRead = (id) =>
  api.patch(`/api/notifications/${id}/read`).then((res) => res.data);

export const markAllAsRead = () =>
  api.patch("/api/notifications/read-all").then((res) => res.data);

export const subscribePush = (subscription) =>
  api.post("/api/notifications/subscribe", subscription).then((res) => res.data);

export const unsubscribePush = (endpoint) =>
  api.delete("/api/notifications/unsubscribe", { params: { endpoint } }).then((res) => res.data);