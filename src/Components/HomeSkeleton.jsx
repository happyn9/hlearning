import React from "react";

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">

      {/* ================= HEADER ================= */}
      <header className="bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
          </div>

          <div className="hidden md:block h-10 w-96 bg-gray-200 rounded-full" />

          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
      </header>

      {/* ================= SECTION 1 : HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="h-10 w-3/4 bg-gray-200 rounded" />
          <div className="h-10 w-2/3 bg-gray-200 rounded" />

          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>

          {/* READY CARD */}
          <div className="bg-gray-100 rounded-2xl p-6 space-y-4">
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <div className="w-72 h-96 bg-gray-200 rounded-2xl" />
        </div>
      </section>

      {/* ================= SECTION 2 : TEACHING + RECOMMENDED ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 space-y-8">
        <div className="h-6 w-56 bg-gray-200 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 space-y-4"
            >
              <div className="h-36 bg-gray-200 rounded-xl" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-9 w-full bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 3 : CODESHOW + PREMIUM ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>

        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </section>

      {/* ================= SECTION 4 : CERTIFICATION + TECH + FAQ ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 space-y-10">
        {/* Certification banner */}
        <div className="h-40 bg-gray-200 rounded-3xl" />

        {/* Technologies */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </section>

      {/* ================= SECTION 5 : FOOTER ================= */}
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}
