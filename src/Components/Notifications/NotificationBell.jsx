import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, BellOff } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useNotifications from "../../hooks/useNotifications";

const sf = { fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif" };

const COLORS = {
  ink: "#1D1D1F",
  gray: "#86868B",
  hairline: "rgba(0,0,0,0.08)",
  surfaceSolid: "#FFFFFF",
  blue: "#0071E3",
  blueTint: "rgba(0,113,227,0.08)",
  red: "#FF3B30",
};

function timeAgo(dateStr, t) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return t("notifications.now");
  if (diff < 3600) return t("notifications.minutesAgo", { count: Math.floor(diff / 60) });
  if (diff < 86400) return t("notifications.hoursAgo", { count: Math.floor(diff / 3600) });
  return t("notifications.daysAgo", { count: Math.floor(diff / 86400) });
}

function EmptyState({ t }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
        style={{ background: "#F5F5F7" }}
      >
        <BellOff size={17} style={{ color: COLORS.gray }} strokeWidth={1.75} />
      </div>
      <p className="text-[13.5px]" style={{ ...sf, color: COLORS.ink, fontWeight: 500 }}>
        {t("notifications.empty")}
      </p>
      <p className="text-[12px] mt-1" style={{ ...sf, color: COLORS.gray }}>
        {t("notifications.emptyHint", "You're all caught up.")}
      </p>
    </div>
  );
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notifications, unreadCount, readOne, readAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Lock body scroll only when the mobile bottom sheet is open
  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handleClick = async (notif) => {
    if (!notif.is_read) await readOne(notif.id);
    setOpen(false);
    if (notif.url) navigate(notif.url);
  };

  const header = (
    <div className="flex items-center justify-between px-4 py-3.5 sm:py-3 border-b shrink-0" style={{ borderColor: COLORS.hairline }}>
      <span className="text-[15px] sm:text-[14px] font-semibold" style={{ ...sf, color: COLORS.ink }}>
        {t("notifications.title")}
      </span>
      {unreadCount > 0 && (
        <button
          onClick={readAll}
          className="flex items-center gap-1 text-[12.5px] sm:text-[12px] px-1.5 py-1 -mr-1.5 rounded-md active:bg-black/[0.04]"
          style={{ ...sf, color: COLORS.blue }}
        >
          <Check size={12} /> {t("notifications.markAllRead")}
        </button>
      )}
    </div>
  );

  const list = (
    <div className="overflow-y-auto flex-1">
      {notifications.length === 0 ? (
        <EmptyState t={t} />
      ) : (
        notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className="w-full text-left px-4 py-3.5 sm:py-3 flex gap-3 items-start border-b active:opacity-70 sm:active:opacity-100 sm:hover:bg-black/[0.02] transition-colors"
            style={{
              borderColor: COLORS.hairline,
              background: n.is_read ? "transparent" : COLORS.blueTint,
            }}
          >
            <span
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ background: n.is_read ? "transparent" : COLORS.blue }}
            />
            <div className="min-w-0 flex-1">
              <p
                className="text-[13.5px] sm:text-[13px] truncate"
                style={{ ...sf, color: COLORS.ink, fontWeight: n.is_read ? 400 : 600 }}
              >
                {n.title}
              </p>
              <p className="text-[13px] sm:text-[12.5px] line-clamp-2 mt-0.5" style={{ ...sf, color: COLORS.gray }}>
                {n.body}
              </p>
              <p className="text-[11.5px] sm:text-[11px] mt-1" style={{ ...sf, color: COLORS.gray }}>
                {timeAgo(n.created_at, t)}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: open ? COLORS.blueTint : "transparent" }}
      >
        <Bell size={18} style={{ color: open ? COLORS.blue : COLORS.ink }} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] text-white"
            style={{ ...sf, background: COLORS.red, fontWeight: 600 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <React.Fragment key="notif-panel">
            {/* ── MOBILE: dimmed backdrop + bottom sheet ── */}
            <motion.div
              className="md:hidden fixed inset-0 z-[70]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ background: "rgba(29,29,31,0.4)" }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="md:hidden fixed inset-x-0 bottom-0 z-[75] rounded-t-[22px] overflow-hidden flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              style={{
                background: COLORS.surfaceSolid,
                boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
                maxHeight: "78vh",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              <div className="flex justify-center pt-2.5 pb-1 shrink-0">
                <span className="w-9 h-1 rounded-full" style={{ background: "#D9D9DC" }} />
              </div>
              {header}
              {list}
            </motion.div>

            {/* ── DESKTOP: anchored dropdown ── */}
            <motion.div
              className="hidden md:flex absolute right-0 mt-2 w-96 rounded-2xl overflow-hidden z-50 flex-col"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              style={{
                background: COLORS.surfaceSolid,
                boxShadow: "0 30px 60px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.04)",
                maxHeight: "70vh",
              }}
            >
              {header}
              {list}
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}