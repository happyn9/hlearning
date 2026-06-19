import {
  ShieldCheck,
  Lock,
  KeyRound,
  Save
} from "lucide-react";

import { useState } from "react";
import { adminService } from "../services/adminService";

export default function SettingsSection() {

  const [pinData, setPinData] = useState({
    current_pin: "",
    new_pin: "",
    confirm_pin: ""
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setPinData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {

    if (pinData.new_pin.length < 4) {
      return alert("PIN must contain at least 4 digits");
    }

    if (pinData.new_pin !== pinData.confirm_pin) {
      return alert("PIN confirmation does not match");
    }

    try {

      setLoading(true);

      await adminService.updatePin({
        current_pin: pinData.current_pin,
        new_pin: pinData.new_pin
      });

      alert("✅ PIN updated successfully");

      setPinData({
        current_pin: "",
        new_pin: "",
        confirm_pin: ""
      });

    } catch (err) {
      // ✅ FIX: l'intercepteur axios rejette déjà avec un Error
      // standard { message }. err.response.data.detail n'existe
      // plus à ce stade — err.message contient déjà le detail.
      alert(
        err?.message ||
        "Failed to update PIN"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Security Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage administrator security and PIN protection
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

        {/* TOP */}
        <div className="flex items-center gap-4 mb-8">

          <div className="w-14 h-14 rounded-2xl bg-lime-500/10 flex items-center justify-center text-lime-400">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Admin PIN
            </h2>

            <p className="text-gray-400 text-sm">
              Protect sensitive actions with a secure PIN
            </p>
          </div>

        </div>

        {/* FORM */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* CURRENT */}
          <div>
            <label className="label">
              Current PIN
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="input-icon"
              />

              <input
                type="password"
                placeholder="Enter current PIN"
                className="input pl-11"
                value={pinData.current_pin}
                onChange={(e)=>
                  updateField(
                    "current_pin",
                    e.target.value
                  )
                }
              />

            </div>
          </div>

          {/* NEW */}
          <div>
            <label className="label">
              New PIN
            </label>

            <div className="relative">

              <KeyRound
                size={18}
                className="input-icon"
              />

              <input
                type="password"
                placeholder="Enter new PIN"
                className="input pl-11"
                value={pinData.new_pin}
                onChange={(e)=>
                  updateField(
                    "new_pin",
                    e.target.value
                  )
                }
              />

            </div>
          </div>

          {/* CONFIRM */}
          <div className="lg:col-span-2">
            <label className="label">
              Confirm New PIN
            </label>

            <div className="relative">

              <ShieldCheck
                size={18}
                className="input-icon"
              />

              <input
                type="password"
                placeholder="Confirm new PIN"
                className="input pl-11"
                value={pinData.confirm_pin}
                onChange={(e)=>
                  updateField(
                    "confirm_pin",
                    e.target.value
                  )
                }
              />

            </div>
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-8 flex items-center gap-3 bg-lime-500 hover:bg-lime-400 transition text-black px-6 py-3 rounded-2xl font-semibold"
        >

          <Save size={18} />

          {loading
            ? "Updating..."
            : "Update PIN"
          }

        </button>

      </div>

    </div>
  );
}