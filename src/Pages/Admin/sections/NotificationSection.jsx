import { useEffect, useState } from "react";
import { Bell, Send, Users, Building2, User } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";

const TARGET_MODES = [
  { id: "all", label: "Tous les étudiants", icon: <Users size={16} /> },
  { id: "center", label: "Par centre", icon: <Building2 size={16} /> },
];

const TYPES = [
  { id: "reminder", label: "Rappel de cours" },
  { id: "motivation", label: "Motivation" },
  { id: "info", label: "Information" },
];

export default function NotificationSection({ centers, setCenters }) {
  const [mode, setMode] = useState("all");
  const [centerId, setCenterId] = useState("");
  const [type, setType] = useState("reminder");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendPush, setSendPush] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (centers.length === 0) loadCenters();
  }, []);

  async function loadCenters() {
    try {
      const res = await adminService.getCenters();
      setCenters(Array.isArray(res) ? res : []);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSend() {
    if (!title.trim() || !body.trim()) {
      return toast.error("Renseignez un titre et un message");
    }
    if (mode === "center" && !centerId) {
      return toast.error("Sélectionnez un centre");
    }

    setSending(true);
    try {
      const payload = {
        title,
        body,
        type,
        send_push: sendPush,
        ...(mode === "all" ? { all_students: true } : { center_id: Number(centerId) }),
      };
      const res = await adminService.broadcastNotification(payload);
      toast.success(`Notification envoyée à ${res.sent_count} étudiant(s)`);
      setTitle("");
      setBody("");
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Échec de l'envoi de la notification");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="rounded-3xl border border-white/8 bg-[#111214]/80 p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#a3e635]/10 flex items-center justify-center">
            <Bell size={18} className="text-[#a3e635]" />
          </div>
          <div>
            <p className="text-[#e8eaf0] font-semibold text-sm">Envoyer une notification</p>
            <p className="text-[#6b7280] text-xs">Rappels de cours, messages de motivation...</p>
          </div>
        </div>

        {/* Target mode */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#9aa0ab]">Destinataires</label>
          <div className="flex gap-2">
            {TARGET_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                  mode === m.id
                    ? "bg-[#a3e635]/10 border-[#a3e635]/40 text-[#a3e635]"
                    : "bg-[#0a0a0a] border-white/10 text-[#9aa0ab] hover:border-white/20"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "center" && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#9aa0ab]">Centre</label>
            <select
              value={centerId}
              onChange={(e) => setCenterId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-[#e8eaf0] outline-none focus:border-[#a3e635]/40"
            >
              <option value="" disabled>
                Sélectionner un centre
              </option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#9aa0ab]">Type</label>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  type === t.id
                    ? "bg-[#a3e635]/10 border-[#a3e635]/40 text-[#a3e635]"
                    : "bg-[#0a0a0a] border-white/10 text-[#9aa0ab] hover:border-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#9aa0ab]">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: N'oubliez pas votre cours du soir !"
            className="px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-[#e8eaf0] placeholder:text-[#6b7280] outline-none focus:border-[#a3e635]/40"
          />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[#9aa0ab]">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Écrivez votre message ici..."
            className="px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-sm text-[#e8eaf0] placeholder:text-[#6b7280] outline-none focus:border-[#a3e635]/40 resize-none"
          />
        </div>

        {/* Push toggle */}
        <label className="flex items-center gap-2.5 text-xs text-[#9aa0ab] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sendPush}
            onChange={(e) => setSendPush(e.target.checked)}
            className="w-4 h-4 rounded accent-[#a3e635]"
          />
          Envoyer aussi une notification push
        </label>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#a3e635] text-[#0a0a0a] text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <Send size={15} />
          {sending ? "Envoi..." : "Envoyer la notification"}
        </button>
      </div>
    </div>
  );
}