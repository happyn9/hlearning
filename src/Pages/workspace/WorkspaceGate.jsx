import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Users, Crown, Loader2, LogIn } from "lucide-react";
import api from "../../services/api";
import WorkspaceOnboarding from "./WorkspaceOnboarding";

const GRADIENTS = [
  "from-purple-500 to-indigo-600",
  "from-pink-500 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-amber-500",
  "from-blue-500 to-cyan-500",
  "from-fuchsia-500 to-pink-600",
];

const gradient = (name) => GRADIENTS[(name?.charCodeAt(0) || 0) % GRADIENTS.length];

export default function WorkspaceGate() {
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState([]);    // créés par moi
  const [joined, setJoined] = useState([]);  // où je suis invité
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch en parallèle
        const [ownedRes, joinedRes] = await Promise.all([
          api.get("/workspaces/my-workspaces").catch(() => []),
          api.get("/workspaces/joined").catch(() => []),
        ]);

        const ownedList = Array.isArray(ownedRes) ? ownedRes : [];
        const joinedList = Array.isArray(joinedRes) ? joinedRes : [];

        setOwned(ownedList);

        // Exclure les workspaces déjà dans "owned" pour éviter doublons
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm">Chargement des workspaces…</p>
        </div>
      </div>
    );
  }

  const hasNothing = owned.length === 0 && joined.length === 0;

  if (hasNothing) return <WorkspaceOnboarding />;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">

        {/* workspace */}
        {owned.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={16} className="text-amber-500" />
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mes workspaces</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{owned.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {owned.map((ws) => (
                <WorkspaceCard key={ws.id} ws={ws} onEnter={enter} badge="admin" />
              ))}
            </div>
          </section>
        )}

        {/* Workspaces rejoints (invités) */}
        {joined.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <LogIn size={16} className="text-purple-500" />
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Invitations reçues</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{joined.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {joined.map((ws) => (
                <WorkspaceCard key={ws.id} ws={ws} onEnter={enter} badge="member" />
              ))}
            </div>
          </section>
        )}

        {/* CTA si seulement invités */}
        {owned.length === 0 && joined.length > 0 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center gap-2 border-2 border-dashed border-purple-300 text-purple-600 px-6 py-3 rounded-2xl text-sm font-medium hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <Plus size={16} /> Créer mon propre workspace
            </button>
          </div>
        )}
      </div>

      {/* Modal onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <WorkspaceOnboarding
              onCreated={(ws) => {
                setShowOnboarding(false);
                navigate(`/workspace/${ws.id}`);
              }}
              onCancel={() => setShowOnboarding(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Workspace Card ───────────────────────────────────────────────
function WorkspaceCard({ ws, onEnter, badge }) {
  const [memberCount, setMemberCount] = useState(null);

  useEffect(() => {
    api.get(`/workspaces/${ws.id}/members`)
      .then((res) => setMemberCount(res.total ?? res.members?.length ?? 0))
      .catch(() => {});
  }, [ws.id]);

  const isAdmin = badge === "admin";

  return (
    <div
      onClick={() => onEnter(ws)}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* Top color strip */}
      <div className={`h-2 bg-gradient-to-r ${gradient(ws.name)}`} />

      <div className="p-5">
        {/* Icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient(ws.name)} flex items-center justify-center text-white text-xl font-bold shadow`}>
            {ws.name[0].toUpperCase()}
          </div>
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
            isAdmin
              ? "bg-amber-100 text-amber-700"
              : "bg-purple-100 text-purple-700"
          }`}>
            {isAdmin ? "👑 Admin" : "👤 Membre"}
          </span>
        </div>

        {/* Name + description */}
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-purple-700 transition">
          {ws.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {ws.description || "Aucune description"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Users size={13} />
            <span className="text-xs">
              {memberCount === null ? "…" : `${memberCount} membre${memberCount > 1 ? "s" : ""}`}
            </span>
          </div>
          <span className="text-xs font-medium text-purple-500 opacity-0 group-hover:opacity-100 transition">
            Ouvrir →
          </span>
        </div>
      </div>
    </div>
  );
}