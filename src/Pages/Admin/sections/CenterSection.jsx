import { useState } from "react";
import { Building2, MapPin, Users } from "lucide-react";
import SectionCard from "../components/SectionCard";
import { adminService } from "../services/adminService";
import toast from "react-hot-toast";

export default function CenterSection({ setCenters }) {
  const [data, setData] = useState({ name: "", address: "", city: "", capacity: "" });

  const updateField = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleCreate = async () => {
    if (!data.name.trim()) return toast.error("Le nom du centre est requis");
    try {
      const res = await adminService.createCenter({
        ...data,
        capacity: data.capacity ? Number(data.capacity) : null
      });
      setCenters(prev => [...prev, res]);
      toast.success("Centre créé avec succès");
      setData({ name: "", address: "", city: "", capacity: "" });
    } catch (e) {
      toast.error(e?.message || "Échec de la création du centre");
    }
  };

  return (
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
  );
}