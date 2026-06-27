import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import SectionCard from "../components/SectionCard";
import { adminService } from "../services/adminService";
import toast from "react-hot-toast";

export default function TeacherSection({ setTeachers }) {
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const updateField = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleCreate = async () => {
    if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
      return toast.error("Tous les champs sont requis");
    }
    try {
      const res = await adminService.createTeacher(data);
      setTeachers(prev => [...prev, res]);
      toast.success("Prof créé avec succès");
      setData({ name: "", email: "", password: "" });
    } catch (e) {
      toast.error(e?.message || "Échec de la création du prof");
    }
  };

  return (
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
  );
}