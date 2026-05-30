import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getPremiumCourses } from "../services/premiumAPI";
import { useNavigate } from "react-router";
import useTriggerWithProgress from "../hooks/triggerWithProgress";
import { motion } from "framer-motion";

const CARDS_PER_SLIDE_DESKTOP = 3;
const CARDS_PER_SLIDE_TABLET = 2;

export default function Premium() {
  const [courses, setCourses] = useState([]);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getPremiumCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load premium courses.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const CARDS_PER_SLIDE =
    windowWidth >= 1024 ? CARDS_PER_SLIDE_DESKTOP : windowWidth >= 640 ? CARDS_PER_SLIDE_TABLET : 1;

  const totalSlides = Math.ceil(courses.length / CARDS_PER_SLIDE);
  const prev = () => setSlide(s => (s === 0 ? totalSlides - 1 : s - 1));
  const next = () => setSlide(s => (s === totalSlides - 1 ? 0 : s + 1));

  if (loading) return <SkeletonCard />;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!courses.length) return <p className="text-center py-10">No courses available.</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative">
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-neutral-600 z-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.02 }}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="lg:w-1/3 self-start lg:mt-3">
          <h2 className="text-3xl sm:text-4xl font-light text-neutral-700 leading-tight">
            Premium Learning Paths
          </h2>
          <p className="mt-5 text-slate-600 max-w-md text-sm sm:text-base">
            Unlock high-value premium courses and build strong, industry-ready skills.
          </p>
        </div>

        <div className="lg:w-2/3 relative w-full">
          {/* MOBILE HORIZONTAL SCROLLER */}
          {windowWidth < 640 ? (
            <div className="flex overflow-x-auto gap-4 scrollbar-hide py-4">
              {courses.map(course => (
                <MobileCard
                  key={course.id}
                  plan={course}
                  onNavigate={() => trigger(() => navigate(`/course/info/${course.id}`))}
                />
              ))}
            </div>
          ) : (
            // DESKTOP/TABLET SLIDER
            <>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <div
                      key={i}
                      className={`min-w-full grid gap-6 ${
                        windowWidth >= 1024
                          ? "grid-cols-3"
                          : windowWidth >= 640
                          ? "grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {courses
                        .slice(i * CARDS_PER_SLIDE, i * CARDS_PER_SLIDE + CARDS_PER_SLIDE)
                        .map(course => (
                          <PlanCard
                            key={course.id}
                            plan={course}
                            onNavigate={() => trigger(() => navigate(`/course/info/${course.id}`))}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Navigation */}
              <div className="flex items-center justify-center gap-5 mt-6">
                <ControlButton onClick={prev}>←</ControlButton>
                <ControlButton onClick={next}>→</ControlButton>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ControlButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
    >
      {children}
    </button>
  );
}

function PlanCard({ plan, onNavigate }) {
  return (
    <div
      onClick={onNavigate}
      className="relative h-65 rounded-3xl overflow-hidden bg-slate-100 group shadow-sm hover:shadow-2xl hover:-translate-y-1 transition cursor-pointer"
    >
      <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-full shadow">
        <Star size={12} /> Premium
      </span>
      <img
        src={plan.image_url}
        alt={plan.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-lg">
        <p className="font-semibold text-sm text-neutral-800">{plan.title}</p>
        <p className="text-xs text-slate-600 line-clamp-1">{plan.description}</p>
      </div>
    </div>
  );
}

// Mobile card design différent
function MobileCard({ plan, onNavigate }) {
  return (
    <div
      onClick={onNavigate}
      className="min-w-62.5 h-64 rounded-2xl overflow-hidden bg-white shadow-md flex flex-col cursor-pointer hover:shadow-xl transition"
    >
      <img
        src={plan.image_url}
        alt={plan.title}
        className="h-32 w-full object-cover"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="font-semibold text-sm text-neutral-800">{plan.title}</p>
          <p className="text-xs text-slate-500 line-clamp-2">{plan.description}</p>
        </div>
        <span className="mt-2 inline-block text-yellow-500 font-medium text-xs">
          <Star size={12} /> Premium
        </span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="h-72 bg-slate-200 rounded-3xl animate-pulse" />;
}