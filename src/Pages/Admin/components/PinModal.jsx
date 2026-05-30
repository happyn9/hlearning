import { Shield } from "lucide-react";

export default function PinModal({
  open,
  pin,
  setPin,
  onConfirm,
  loading,
  onClose
}) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div className="bg-[#111] p-6 rounded-2xl w-80 space-y-4 border border-white/10">

        <div className="flex gap-2 items-center">
          <Shield size={18}/>
          <h2 className="font-semibold">
            Admin PIN
          </h2>
        </div>

        <input
          type="password"
          className="input"
          placeholder="PIN"
          value={pin}
          onChange={(e)=>setPin(e.target.value)}
        />

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 border border-white/10 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-white text-black py-2 rounded-lg"
          >
            {loading ? "Loading..." : "Confirm"}
          </button>

        </div>

      </div>

    </div>
  );
}