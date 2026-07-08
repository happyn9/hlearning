import { useState } from "react";
import { Building2, MapPin, Users, Pencil, Trash2, X, Check } from "lucide-react";
import SectionCard from "../components/SectionCard";
import toast from "react-hot-toast";

export default function CenterSection({ centers, loading, onCreate, onUpdate, onDelete }) {
  const [data, setData] = useState({ name: "", address: "", city: "", capacity: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", address: "", city: "", capacity: "" });
  const [deletingId, setDeletingId] = useState(null);

  const updateField = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleCreate = async () => {
    if (!data.name.trim()) return toast.error("Le nom du centre est requis");
    try {
      await onCreate({
        ...data,
        capacity: data.capacity ? Number(data.capacity) : null
      });
      toast.success("Centre créé avec succès");
      setData({ name: "", address: "", city: "", capacity: "" });
    } catch (e) {
      toast.error(e?.message || "Échec de la création du centre");
    }
  };

  function startEdit(center) {
    setEditingId(center.id);
    setEditData({
      name: center.name || "",
      address: center.address || "",
      city: center.city || "",
      capacity: center.capacity ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({ name: "", address: "", city: "", capacity: "" });
  }

  async function saveEdit(centerId) {
    if (!editData.name.trim()) return toast.error("Le nom du centre est requis");
    try {
      const payload = {
        ...editData,
        capacity: editData.capacity !== "" ? Number(editData.capacity) : null,
      };
      await onUpdate(centerId, payload);
      toast.success("Centre mis à jour");
      cancelEdit();
    } catch (e) {
      toast.error(e?.message || "Échec de la mise à jour");
    }
  }

  async function handleDelete(centerId) {
    setDeletingId(centerId);
    try {
      await onDelete(centerId);
      toast.success("Centre supprimé");
    } catch (e) {
      toast.error(e?.message || "Échec de la suppression");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionCard title="Add Center" onAdd={handleCreate}>
        <div className="space-y-5">
          <div>
            <label className="label">Center Name</label>
            <div className="relative">
              <Building2 size={18} className="input-icon" />
              <input
                value={data.name}
                placeholder="Centre Lusaka"
                className="input pl-11"
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <div className="relative">
              <MapPin size={18} className="input-icon" />
              <input
                value={data.address}
                placeholder="Plot 123, Cairo Road"
                className="input pl-11"
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={data.city}
              placeholder="City"
              className="input"
              onChange={(e) => updateField("city", e.target.value)}
            />
            <div className="relative">
              <Users size={18} className="input-icon" />
              <input
                type="number"
                value={data.capacity}
                placeholder="Capacity"
                className="input pl-11"
                onChange={(e) => updateField("capacity", e.target.value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ================= LISTE DES CENTRES ================= */}
      <div className="rounded-3xl border border-white/8 bg-[#111214]/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <p className="text-[#e8eaf0] font-semibold text-sm">Tous les centres</p>
        </div>

        {loading ? (
          <div className="p-6 h-40 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#a3e635]/30 border-t-[#a3e635] animate-spin" />
          </div>
        ) : centers.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-2">
            <Building2 size={26} className="text-[#6b7280] mb-1" />
            <p className="text-[#e8eaf0] font-medium text-sm">Aucun centre pour le moment</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-[#6b7280]">
                <th className="px-5 py-3.5 font-medium">Nom</th>
                <th className="px-5 py-3.5 font-medium">Ville</th>
                <th className="px-5 py-3.5 font-medium">Adresse</th>
                <th className="px-5 py-3.5 font-medium">Capacité</th>
                <th className="px-5 py-3.5 font-medium">Statut</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((center) => {
                const isEditing = editingId === center.id;
                return (
                  <tr key={center.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-sm outline-none focus:border-[#a3e635]/40"
                        />
                      ) : (
                        <span className="text-[#e8eaf0] font-medium">{center.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          value={editData.city}
                          onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-sm outline-none focus:border-[#a3e635]/40"
                        />
                      ) : (
                        <span className="text-[#9aa0ab]">{center.city || "—"}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          value={editData.address}
                          onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-sm outline-none focus:border-[#a3e635]/40"
                        />
                      ) : (
                        <span className="text-[#9aa0ab]">{center.address || "—"}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.capacity}
                          onChange={(e) => setEditData(prev => ({ ...prev, capacity: e.target.value }))}
                          className="w-20 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-sm outline-none focus:border-[#a3e635]/40"
                        />
                      ) : (
                        <span className="text-[#9aa0ab]">{center.capacity ?? "—"}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          center.is_active
                            ? "bg-[#a3e635]/10 text-[#a3e635]"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {center.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(center.id)}
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
                              onClick={() => startEdit(center)}
                              className="p-2 rounded-lg bg-white/5 text-[#9aa0ab] hover:bg-white/10 hover:text-[#e8eaf0] transition-colors"
                              title="Modifier"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(center.id)}
                              disabled={deletingId === center.id}
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