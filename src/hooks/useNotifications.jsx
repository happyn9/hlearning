import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "../context/UserContext";
import { getNotifications, markAsRead,markAllAsRead } from "../services/notificationAPI";

const POLL_INTERVAL = 30000;

export default function useNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error("Erreur lors du chargement des notifications", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [user, fetchNotifications]);

  const readOne = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markAsRead(id);
    } catch (err) {
      console.error(err);
      fetchNotifications(); // rollback si erreur
    }
  };

  const readAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllAsRead();
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  return { notifications, unreadCount, loading, readOne, readAll, refresh: fetchNotifications };
}