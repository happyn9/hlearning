import React from "react";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────────────────
   HomeSkeleton — version "5D ultra"
   Même structure que les vrais composants (Navbar/Hero,
   HowItWorks, Tuition, Premium, Footer + placeholders
   génériques pour les sections sans source), mais avec :
   - un effet shimmer animé (dégradé qui balaye), pas un pulse plat
   - un badge de chargement flottant avec profondeur (ombres
     superposées, glow, anneau animé)
───────────────────────────────────────────────────────── */

// blocs clairs (fond papier) et sombres (IDE window / footer)
const L = "shimmer-light";
const D = "shimmer-dark";

export default function HomeSkeleton() {


  return (
    <div className="min-h-screen bg-[#FAF9F5] relative">
      <style>{`
        @keyframes shimmerMove {
          0%   { background-position: 200% 0; }
          100% { background-position: -60% 0; }
        }
        .shimmer-light {
          background-image: linear-gradient(100deg,
            #e9e9ec 20%, #f4f4f6 40%, #e9e9ec 60%);
          background-size: 250% 100%;
          animation: shimmerMove 2s ease-in-out infinite;
        }
        .shimmer-dark {
          background-image: linear-gradient(100deg,
            rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.16) 40%,
            rgba(255,255,255,0.05) 60%);
          background-size: 250% 100%;
          animation: shimmerMove 2s ease-in-out infinite;
        }
        @keyframes loaderSpin { to { transform: rotate(360deg); } }
        @keyframes loaderGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(94,234,212,0.35), 0 14px 34px -10px rgba(18,20,28,0.55), 0 4px 10px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.08) inset; }
          50%      { box-shadow: 0 0 0 8px rgba(94,234,212,0.10), 0 14px 34px -10px rgba(18,20,28,0.55), 0 4px 10px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.08) inset; }
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-light, .shimmer-dark, .loader-ring, .loader-pill {
            animation: none !important;
          }
        }
      `}</style>

      {/* ═══ BADGE DE CHARGEMENT — "5D ultra" ═══ */}
      <LoadingBadge />

      {/* bulle chat flottante — statique, même position que le vrai
          bouton, pour éviter un pop-in visuel au chargement */}
      <div
        aria-hidden
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full ${L}`}
      />

      <NavbarSkeleton />
      <HeroSkeleton />

      <div className="max-w-6xl mx-auto">
        <HowItWorksSkeleton />
      </div>

      <TuitionSkeleton />
      <PremiumSkeleton />
      <CoursesSkeleton />
      <CertificateSkeleton />
      <VisaSkeleton />
      <WhyChooseSkeleton />
      <TechnologiesSkeleton />
      <FooterSkeleton />
    </div>
  );
}

/* ================= LOADING BADGE (5D) ================= */

function LoadingBadge() {
  const {t} =useTranslation();
  return (
    <div className="fixed top-5 lg:bottom-15 left-1/2 -translate-x-1/2 z-[70] loader-pill">
      <div
        className="flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-full select-none"
        style={{
          background: "linear-gradient(180deg, #2a2a2a 0%, #1c1c1c 55%, #141414 100%)",
          animation: "loaderGlow 2.2s ease-in-out infinite",
        }}
      >
        {/* anneau qui tourne — spinner à profondeur */}
        <span
          className="loader-ring relative w-5 h-5 rounded-full shrink-0"
          style={{
            background:
              "conic-gradient(from 0deg, #5EEAD4 0deg, #5EEAD4 90deg, rgba(255,255,255,0.12) 90deg, rgba(255,255,255,0.12) 360deg)",
            animation: "loaderSpin 0.9s linear infinite",
            boxShadow: "0 0 6px rgba(94,234,212,0.6)",
          }}
        >
          <span
            className="absolute inset-[3px] rounded-full"
            style={{ background: "#1c1c1c" }}
          />
        </span>

        <span
          className="text-[13px] font-medium tracking-tight"
          style={{ color: "#F5F5F5", fontFamily: "'Inter', sans-serif" }}
        >
          {t("skeleton.loading")}
        </span>
      </div>
    </div>
  );
}

/* ================= NAVBAR ================= */

function NavbarSkeleton() {
  return (
    <>
      <header className="hidden md:block w-full sticky top-0 z-30 border-b border-black/[0.06] bg-white/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-14">
          <div className="flex items-center gap-2">
            <div className={`w-[26px] h-[26px] rounded-full ${L}`} />
            <div className={`h-4 w-24 rounded ${L}`} />
          </div>
          <div className={`h-9 w-60 rounded-full ${L}`} />
          <div className={`w-8 h-8 rounded-full ${L}`} />
        </div>
      </header>

      <header className="md:hidden flex items-center justify-between px-5 pt-12 pb-3 border-b border-black/[0.06] bg-white">
        <div className="flex items-center gap-2">
          <div className={`w-[22px] h-[22px] rounded-full ${L}`} />
          <div className={`h-4 w-20 rounded ${L}`} />
        </div>
        <div className={`h-6 w-16 rounded-full ${L}`} />
      </header>

      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-5 py-3 rounded-[28px] border border-black/[0.06] bg-white/90">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-5 h-5 rounded ${L}`} />
            <div className={`h-1.5 w-6 rounded ${L}`} />
          </div>
        ))}
      </nav>
    </>
  );
}

/* ================= HERO ================= */

function HeroSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="flex flex-col lg:flex-row gap-14 items-start">
        {/* LEFT */}
        <div className="flex-1 flex flex-col w-full">
          <div className={`h-3 w-40 rounded mb-7 ${L}`} />

          <div className="mb-6 space-y-3">
            <div className={`h-10 w-3/4 rounded ${L}`} />
            <div className={`h-10 w-1/2 rounded ${L}`} />
          </div>

          <div className="space-y-3 mb-10 max-w-md">
            <div className={`h-4 w-full rounded ${L}`} />
            <div className={`h-4 w-5/6 rounded ${L}`} />
            <div className={`h-4 w-2/3 rounded ${L}`} />
          </div>

          <div className="flex items-center gap-3 mb-12 flex-wrap">
            <div className={`h-11 w-40 rounded-full ${L}`} />
            <div className={`h-11 w-40 rounded-full ${L}`} />
          </div>

          <div className="flex items-center gap-3 mb-14">
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`w-7 h-7 rounded-full border-2 border-[#FAF9F5] ${L}`} />
              ))}
            </div>
            <div className={`h-3 w-40 rounded ${L}`} />
          </div>

          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${L}`} />
                <div className={`h-3 w-32 rounded ${L}`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — fenêtre IDE */}
        <div className="w-full lg:w-[440px] relative">
          <div
            className="rounded-2xl overflow-hidden border border-black/10"
            style={{
              background: "#12141C",
              boxShadow: "0 20px 60px -15px rgba(18,20,28,0.35)",
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <div className={`h-3 w-20 rounded ml-4 ${D}`} />
            </div>
            <div className="px-5 py-5 space-y-2.5">
              <div className={`h-3 w-2/3 rounded ${D}`} />
              <div className={`h-3 w-1/2 rounded ml-4 ${D}`} />
              <div className={`h-3 w-1/3 rounded ml-4 ${D}`} />
              <div className={`h-3 w-3/5 rounded ${D}`} />
              <div className={`mt-4 ml-8 h-12 rounded-lg ${D}`} />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-16 rounded ${D}`} />
                <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full w-3/5 rounded-full ${D}`} />
                </div>
              </div>
              <div className={`h-3 w-10 rounded ${D}`} />
            </div>
          </div>

          <div
            className="absolute -bottom-4 -right-3 w-16 h-7 rounded-lg"
            style={{ background: "#12141C", border: "1px solid rgba(94,234,212,0.3)" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ================= HOW IT WORKS ================= */

function HowItWorksSkeleton() {
  return (
    <section className="py-16 px-6 sm:px-10">
      <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-20">
        <div>
          <div className={`h-3 w-32 rounded mb-5 ${L}`} />
          <div className="space-y-3 mb-4">
            <div className={`h-8 w-3/4 rounded ${L}`} />
            <div className={`h-8 w-1/2 rounded ${L}`} />
          </div>
          <div className="space-y-2 max-w-sm mb-8">
            <div className={`h-3.5 w-full rounded ${L}`} />
            <div className={`h-3.5 w-5/6 rounded ${L}`} />
          </div>

          <div className="divide-y divide-black/[0.06]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[40px_1fr] gap-4 py-5">
                <div className="flex flex-col items-center gap-2 pt-0.5">
                  <div className={`h-2 w-5 rounded ${L}`} />
                  <div className={`w-8 h-8 rounded-lg ${L}`} />
                </div>
                <div>
                  <div className={`h-3.5 w-40 rounded mb-2 ${L}`} />
                  <div className="space-y-1.5">
                    <div className={`h-3 w-full rounded ${L}`} />
                    <div className={`h-3 w-4/5 rounded ${L}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`h-3 w-32 rounded mt-7 ${L}`} />
        </div>

        <div>
          <div className={`rounded-[20px] aspect-[4/3] ${D}`} style={{ background: "#12141C" }} />
          <div className="flex items-center gap-3 mt-4">
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`w-[26px] h-[26px] rounded-full border-2 border-[#FAF9F5] ${L}`} />
              ))}
            </div>
            <div className={`h-3 w-32 rounded ${L}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TUITION ================= */

function TuitionSkeleton() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className={`h-3 w-28 rounded mx-auto mb-4 ${L}`} />
          <div className={`h-9 w-2/3 rounded mx-auto mb-3 ${L}`} />
          <div className={`h-4 w-52 rounded mx-auto ${L}`} />
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-10 w-28 rounded-full ${L}`} />
          ))}
        </div>

        <div className="rounded-[20px] overflow-hidden border border-black/[0.06] mb-6">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-black/[0.06]">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <div className={`h-3 w-16 rounded ml-2 ${L}`} />
          </div>
          <div className="p-5 space-y-3">
            <div className={`h-4 w-5/6 rounded ${L}`} />
            <div className={`h-4 w-3/4 rounded ${L}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-9">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 border border-black/[0.06] space-y-3">
              <div className={`h-9 w-9 rounded-lg ${L}`} />
              <div className={`h-3 w-20 rounded ${L}`} />
              <div className={`h-3 w-28 rounded ${L}`} />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className={`h-12 w-44 rounded-full ${L}`} />
        </div>
      </div>
    </section>
  );
}

/* ================= PREMIUM ================= */

function PremiumSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="lg:w-1/3 space-y-4">
          <div className={`h-9 w-3/4 rounded ${L}`} />
          <div className="space-y-2 max-w-md">
            <div className={`h-3.5 w-full rounded ${L}`} />
            <div className={`h-3.5 w-5/6 rounded ${L}`} />
          </div>
        </div>

        <div className="lg:w-2/3 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`relative h-65 rounded-3xl ${L}`}>
                <div className="absolute top-3 left-3 h-5 w-20 rounded-full bg-white/60" />
                <div className="absolute bottom-3 left-3 right-3 h-14 rounded-xl bg-white/80" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-5 mt-6">
            <div className={`w-9 h-9 rounded-full ${L}`} />
            <div className={`w-9 h-9 rounded-full ${L}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= GENERIC SECTIONS ================= */

function CoursesSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className={`h-6 w-56 rounded mb-8 ${L}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5 space-y-3 border border-black/[0.05]">
            <div className={`h-36 rounded-xl ${L}`} />
            <div className={`h-3.5 w-3/4 rounded ${L}`} />
            <div className={`h-3.5 w-1/2 rounded ${L}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function CertificateSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className={`h-40 sm:h-48 rounded-3xl ${L}`} />
    </section>
  );
}

function VisaSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <div className={`h-8 w-2/3 rounded ${L}`} />
          <div className="space-y-2">
            <div className={`h-3.5 w-full rounded ${L}`} />
            <div className={`h-3.5 w-5/6 rounded ${L}`} />
          </div>
          <div className={`h-11 w-40 rounded-full ${L}`} />
        </div>
        <div className={`h-64 rounded-3xl ${L}`} />
      </div>
    </section>
  );
}

function WhyChooseSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className={`h-6 w-48 rounded mb-8 mx-auto ${L}`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-6 space-y-3 border border-black/[0.05]">
            <div className={`w-10 h-10 rounded-xl ${L}`} />
            <div className={`h-3.5 w-2/3 rounded ${L}`} />
            <div className={`h-3 w-full rounded ${L}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TechnologiesSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className={`h-6 w-48 rounded mb-6 ${L}`} />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-16 rounded-xl ${L}`} />
        ))}
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */

function FooterSkeleton() {
  return (
    <div className="bg-[#F9FAFB]">
      <section className="pb-20 pt-2 max-w-5xl mx-auto px-6">
        <div className={`h-8 w-56 rounded mx-auto mt-3 mb-8 ${L}`} />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl px-8 py-6 flex items-center justify-between">
              <div className={`h-4 w-2/3 rounded ${L}`} />
              <div className={`w-4 h-4 rounded ${L}`} />
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-5 gap-14">
            <div className="md:col-span-2 space-y-6">
              <div className={`h-7 w-32 rounded ${D}`} />
              <div className="space-y-2 max-w-sm">
                <div className={`h-3 w-full rounded ${D}`} />
                <div className={`h-3 w-5/6 rounded ${D}`} />
              </div>
              <div className="flex gap-0">
                <div className={`h-11 flex-1 rounded-l-xl ${D}`} />
                <div className={`h-11 w-28 rounded-r-xl ${D}`} />
              </div>
            </div>

            <div className="space-y-4">
              <div className={`h-4 w-20 rounded ${D}`} />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`h-3 w-24 rounded ${D}`} />
              ))}
            </div>

            <div className="space-y-4">
              <div className={`h-4 w-16 rounded ${D}`} />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={`h-3 w-20 rounded ${D}`} />
              ))}
            </div>

            <div className="space-y-4">
              <div className={`h-4 w-20 rounded ${D}`} />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded ${D}`} />
                ))}
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className={`w-7 h-7 rounded ${D}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-800 my-16" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className={`h-3 w-48 rounded ${D}`} />
            <div className={`h-3 w-32 rounded ${D}`} />
            <div className={`h-9 w-36 rounded-xl ${D}`} />
            <div className={`h-3 w-40 rounded ${D}`} />
          </div>
        </div>
      </footer>
    </div>
  );
}