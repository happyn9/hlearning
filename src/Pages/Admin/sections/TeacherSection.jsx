import { useEffect, useState } from "react";
import { User, Mail, Lock, Pencil, Trash2, X, Check } from "lucide-react";
import SectionCard from "../components/SectionCard";
import { adminService } from "../services/adminService";
import toast from "react-hot-toast";

export default function TeacherSection({ setTeachers }) {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [teachers, setLocalTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    setLoading(true);
    try {
      const res = await adminService.getTeachers();
      const list = Array.isArray(res) ? res : [];
      setLocalTeachers(list);
      setTeachers(list);
    } catch (e) {
      toast.error(e?.message || "Erreur de chargement des profs");
    } finally {
      setLoading(false);
    }
  }

  const updateField = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleCreate = async () => {
    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      return toast.error("Tous les champs sont requis");
    }
    try {
      const res = await adminService.createTeacher(data);
      setLocalTeachers(prev => [...prev, res]);
      setTeachers(prev => [...prev, res]);
      toast.success("Prof créé avec succès");
      setData({ name: "", email: "", password: "" });
    } catch (e) {
      toast.error(e?.message || "Échec de la création du prof");
    }
  };

  function startEdit(teacher) {
    setEditingId(teacher.id);
    setEditData({ name: teacher.name, email: teacher.email });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({ name: "", email: "" });
  }

  async function saveEdit(teacherId) {
    if (!editData.name.trim() || !editData.email.trim()) {
      return toast.error("Nom et email requis");
    }
    try {
      const res = await adminService.updateTeacher(teacherId, editData);
      setLocalTeachers(prev => prev.map(t => (t.id === teacherId ? { ...t, ...res } : t)));
      setTeachers(prev => prev.map(t => (t.id === teacherId ? { ...t, ...res } : t)));
      toast.success("Prof mis à jour");
      cancelEdit();
    } catch (e) {
      toast.error(e?.message || "Échec de la mise à jour");
    }
  }

  async function handleDelete(teacherId) {
    setDeletingId(teacherId);
    try {
      await adminService.deleteTeacher(teacherId);
      setLocalTeachers(prev => prev.filter(t => t.id !== teacherId));
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
      toast.success("Prof supprimé");
    } catch (e) {
      toast.error(e?.message || "Échec de la suppression");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionCard title="Add Teacher" onAdd={handleCreate}>
        <div className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={18} className="input-icon" />
              <input
                value={data.name}
                placeholder="John Mwape"
                className="input pl-11"
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={18} className="input-icon" />
              <input
                value={data.email}
                placeholder="teacher@hlearning.com"
                className="input pl-11"
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Temporary Password</label>
            <div className="relative">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                value={data.password}
                placeholder="••••••••"
                className="input pl-11"
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ================= LISTE DES PROFS ================= */}
      <div className="rounded-3xl border border-white/8 bg-[#111214]/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <p className="text-[#e8eaf0] font-semibold text-sm">Tous les profs</p>
        </div>

        {loading ? (
          <div className="p-6 h-40 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#a3e635]/30 border-t-[#a3e635] animate-spin" />
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-2">
            <User size={26} className="text-[#6b7280] mb-1" />
            <p className="text-[#e8eaf0] font-medium text-sm">Aucun prof pour le moment</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-[#6b7280]">
                <th className="px-5 py-3.5 font-medium">Nom</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Statut</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => {
                const isEditing = editingId === teacher.id;
                return (
                  <tr key={teacher.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-sm outline-none focus:border-[#a3e635]/40"
                        />
                      ) : (
                        <span className="text-[#e8eaf0] font-medium">{teacher.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-sm outline-none focus:border-[#a3e635]/40"
                        />
                      ) : (
                        <span className="text-[#9aa0ab]">{teacher.email}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          teacher.is_active
                            ? "bg-[#a3e635]/10 text-[#a3e635]"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {teacher.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(teacher.id)}
                              className="p-2 rounded-lg bg-[#a3e635]/10 text-[#a3e635] hover:bg-[#a3e635]/20 transition-colors"
                              title="Enregistrer"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 rounded-lg bg-white/5 text-[#9aa0ab] hover:bg-white/10 transition-colors"
                              title="Annuler"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(teacher)}
                              className="p-2 rounded-lg bg-white/5 text-[#9aa0ab] hover:bg-white/10 hover:text-[#e8eaf0] transition-colors"
                              title="Modifier"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(teacher.id)}
                              disabled={deletingId === teacher.id}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}