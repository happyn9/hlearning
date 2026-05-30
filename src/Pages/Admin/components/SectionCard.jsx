import { Plus } from "lucide-react";

export default function SectionCard({
  title,
  onAdd,
  children
}) {

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">

      <div className="flex justify-between items-center">

        <h2 className="font-semibold">
          {title}
        </h2>

        <button
          onClick={onAdd}
          className="bg-white text-black px-3 py-1 rounded-lg"
        >
          <Plus size={16}/>
        </button>

      </div>

      {children}

    </div>
  );
}