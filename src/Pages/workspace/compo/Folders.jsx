import { Folder } from "lucide-react";

export default function Folders() {

  const folders = [
    "Projects",
    "Courses",
    "Design",
    "Documents",
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {folders.map((f, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition cursor-pointer"
        >

          <Folder className="text-yellow-500 mb-4" size={28} />

          <h3 className="font-semibold text-gray-700">
            {f}
          </h3>

        </div>
      ))}

    </div>
  );
}