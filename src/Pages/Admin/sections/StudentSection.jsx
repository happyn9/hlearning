import { useState } from "react";
import { GraduationCap, Search, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentSection({ students, centers, loading, onChangeCenter }) {
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function handleCenterChange(studentId, centerId) {
    if (!centerId) return;
    setUpdatingId(studentId);
    try {
      await onChangeCenter(studentId, Number(centerId));
      toast.success("Centre mis à jour");
    } catch (e) {
      toast.error(e?.message || "Échec de la mise à jour du centre");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un étudiant..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#111214]/80 border border-white/8 text-sm text-[#e8eaf0] placeholder:text-[#6b7280] outline-none focus:border-[#a3e635]/40 transition-colors"
        />
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/8 bg-[#111214]/80 p-6 h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#a3e635]/30 border-t-[#a3e635] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/8 bg-[#111214]/80 p-10 flex flex-col items-center justify-center text-center gap-2">
          <GraduationCap size={28} className="text-[#6b7280] mb-2" />
          <p className="text-[#e8eaf0] font-medium">Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/8 bg-[#111214]/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-[#6b7280]">
                <th className="px-5 py-3.5 font-medium">Nom</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Statut</th>
                <th className="px-5 py-3.5 font-medium">Centre</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3.5 text-[#e8eaf0] font-medium">{student.name}</td>
                  <td className="px-5 py-3.5 text-[#9aa0ab]">{student.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.is_active
                          ? "bg-[#a3e635]/10 text-[#a3e635]"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {student.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative w-48">
                      <Building2
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none"
                      />
                      <select
                        value={student.center_id || ""}
                        disabled={updatingId === student.id}
                        onChange={(e) => handleCenterChange(student.id, e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0a0a0a] border border-white/10 text-[#e8eaf0] text-xs outline-none focus:border-[#a3e635]/40 disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Aucun centre
                        </option>
                        {centers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}