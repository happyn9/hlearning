import React from "react";
import { ArrowLeft, Lock } from "lucide-react";

export default function SentenceModePage({ onBack }) {
  const units = [
    {
      id: 1,
      title: "Introducing yourself",
      locked: true,
      img: "/images/introducing-yourself.png",
    },
    {
      id: 2,
      title: "Introducing someone else",
      locked: true,
      img: "/images/introducing-someone-else.png",
    },
    {
      id: 3,
      title: "Formal introductions",
      locked: true,
      img: "/images/formal-introductions.png",
    },
  ];

  return (
    <div className="bg-indigo-50 text-indigo-900 px-8 mx-auto py-10 max-w-3xl select-none">
      {/* Back button + title */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-700 font-semibold mb-6 hover:text-indigo-900 transition"
        aria-label="Back"
      >
        <ArrowLeft size={20} />
        <span>Sentence Mode</span>
      </button>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-6 max-w-xl leading-relaxed">
        The Sentence Mode is a unique way to learn everyday phrases. This
        interactive mode creates an engaging learning environment, helping you
        improve your pronunciation skills.
      </p>

      {/* Premium alert */}
      <div className="bg-neutral-600 text-white px-6 py-4 rounded-2xl flex items-center justify-between mb-8 shadow-lg">
        <span className="font-semibold text-center flex-1">
          Sentence Mode is a premium feature. Upgrade now to unlock it.
        </span>
        <button
          className="bg-white text-yellow-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100 transition"
          type="button"
        >
          Get premium
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center mb-6 gap-4">
        <div className="text-sm font-semibold w-12 text-indigo-700">0%</div>
        <div className="flex-1 bg-indigo-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      {/* Unit list */}
      <section>
        <h2 className="text-lg font-bold mb-4">Making introductions</h2>
        <ul className="space-y-4">
          {units.map(({ id, title, locked, img }) => (
            <li
              key={id}
              className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md cursor-not-allowed opacity-70 hover:opacity-80 transition"
              title={locked ? "Premium content locked" : ""}
            >
              <div className="flex-shrink-0 rounded-full overflow-hidden w-14 h-14 border border-indigo-300 shadow-sm">
                <img
                  src={img}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-indigo-900">{title}</span>
                {locked && (
                  <div className="inline-flex items-center gap-1 text-pink-600 text-xs font-semibold mt-1 bg-pink-100 rounded-full px-3 py-1 select-none">
                    <Lock size={12} />
                    Premium
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}