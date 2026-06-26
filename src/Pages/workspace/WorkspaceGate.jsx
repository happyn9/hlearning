import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Users, Crown, Loader2, LogIn, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import WorkspaceOnboarding from "./WorkspaceOnboarding";

// ── Color assignment ─────────────────────────────────────────────────────────
const ACCENTS = [
  { accent: "#3730A3", bg: "#EEF2FF", text: "#4338CA" },
  { accent: "#0F766E", bg: "#F0FDFA", text: "#0D9488" },
  { accent: "#B45309", bg: "#FFFBEB", text: "#D97706" },
  { accent: "#1D4ED8", bg: "#EFF6FF", text: "#2563EB" },
  { accent: "#6D28D9", bg: "#F5F3FF", text: "#7C3AED" },
  { accent: "#0369A1", bg: "#F0F9FF", text: "#0284C7" },
];

const getAccent = (name) => ACCENTS[(name?.charCodeAt(0) || 0) % ACCENTS.length];

// ── Workspace card ───────────────────────────────────────────────────────────
function WorkspaceCard({ ws, onEnter, badge, index }) {
  const [memberCount, setMemberCount] = useState(null);
  const [hovered, setHovered] = useState(false);
  const { accent, bg, text } = getAccent(ws.name);
  const isAdmin = badge === "admin";

  useEffect(() => {
    api.get(`/workspaces/${ws.id}/members`)
      .then((res) => setMemberCount(res.total ?? res.members?.length ?? 0))
      .catch(() => {});
  }, [ws.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onEnter(ws)}
      className="relative bg-white rounded-2xl border border-slate-200 cursor-pointer overflow-hidden transition-shadow duration-200"
      style={{ boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      {/* Animated top accent */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute top-0 left-0 right-0 h-[3px] origin-left"
        style={{ background: accent }}
      />

      <div className="p-6">
        {/* Avatar + badge */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold tracking-tight transition-colors duration-200"
            style={{ background: hovered ? accent : bg, color: hovered ? "#fff" : accent }}
          >
            {ws.name[0].toUpperCase()}
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: isAdmin ? "#FFFBEB" : "#EEF2FF", color: isAdmin ? "#B45309" : "#3730A3" }}
          >
            {isAdmin ? "Admin" : "Membre"}
          </span>
        </div>

        {/* Name + desc */}
        <h3 className="text-[15px] font-semibold text-slate-800 mb-1.5 tracking-tight">
          {ws.name}
        </h3>
        <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2 mb-5">
          {ws.description || "Aucune description pour ce workspace."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users size={13} />
            <span className="text-[12px]">
              {memberCount === null ? "…" : `${memberCount} membre${memberCount > 1 ? "s" : ""}`}
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[12px] font-semibold transition-all duration-150"
            style={{ color: hovered ? accent : "#CBD5E1", transform: hovered ? "translateX(2px)" : "translateX(0)" }}
          >
            Ouvrir <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, label, count, color }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <Icon size={14} style={{ color }} />
      <p className="text-[11px] font-bold tracking-[.1em] uppercase text-slate-500">{label}</p>
      <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#EEF2FF", color: "#3730A3" }}
      >
        {count}
      </span>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function WorkspaceGate() {
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState([]);
  const [joined, setJoined] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [ownedRes, joinedRes] = await Promise.all([
          api.get("/workspaces/my-workspaces").catch(() => []),
          api.get("/workspaces/joined").catch(() => []),
        ]);
        const ownedList = Array.isArray(ownedRes) ? ownedRes : [];
        const joinedList = Array.isArray(joinedRes) ? joinedRes : [];
        setOwned(ownedList);
        const ownedIds = new Set(ownedList.map((w) => w.id));
        setJoined(joinedList.filter((w) => !ownedIds.has(w.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const enter = (ws) => {
    localStorage.setItem("workspaceId", ws.id);
    navigate(`/workspace/${ws.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F6F3" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <p className="text-[13px] text-slate-400 font-medium">Chargement des workspaces…</p>
        </div>
      </div>
    );
  }

  if (owned.length === 0 && joined.length === 0) return <WorkspaceOnboarding />;

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: "#F7F6F3", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-[11px] font-bold tracking-[.12em] uppercase text-indigo-700 mb-2">Workspaces</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#1E1B4B" }}>
              Choisissez votre espace
            </h1>
            <button
              onClick={() => setShowOnboarding(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold bg-indigo-800 hover:bg-indigo-900 transition-colors"
            >
              <Plus size={14} /> Nouveau workspace
            </button>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Owned */}
          {owned.length > 0 && (
            <section>
              <SectionLabel icon={Crown} label="Mes workspaces" count={owned.length} color="#B45309" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {owned.map((ws, i) => (
                  <WorkspaceCard key={ws.id} ws={ws} onEnter={enter} badge="admin" index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Joined */}
          {joined.length > 0 && (
            <section>
              <SectionLabel icon={LogIn} label="Invitations reçues" count={joined.length} color="#3730A3" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {joined.map((ws, i) => (
                  <WorkspaceCard key={ws.id} ws={ws} onEnter={enter} badge="member" index={i} />
                ))}
              </div>
            </section>
          )}

          {/* CTA when only joined */}
          {owned.length === 0 && joined.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center pt-2"
            >
              <button
                onClick={() => setShowOnboarding(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-dashed border-indigo-300 text-indigo-700 text-[13.5px] font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <Plus size={14} /> Créer mon propre workspace
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Onboarding modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,15,25,0.6)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <WorkspaceOnboarding
                onCreated={(ws) => { setShowOnboarding(false); navigate(`/workspace/${ws.id}`); }}
                onCancel={() => setShowOnboarding(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}