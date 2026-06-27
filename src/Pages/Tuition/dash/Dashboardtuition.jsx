import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useUser } from "../../../context/UserContext";
import { useNavigate, useParams, useSearchParams } from "react-router";
import api from "../../../services/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, X,
  LayoutDashboard, FileText, FolderOpen, MessageCircle, Settings,
  Play, CheckCircle2, Circle, ChevronRight, User, Mail, Sun, Bell,
  Sparkles, Maximize2, Stamp,
} from "lucide-react";
import ChatCourseAi from "../../../Components/ChatCourseAi";
import NavIcon from "../../Admin/components/NavIcon";
import ProgressOrbit from "../../Progressorbit";

/* ══════════════════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════════════════ */
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/* ══════════════════════════════════════════════════════════════
   COPY — EN / FR
══════════════════════════════════════════════════════════════ */
const COPY = {
  english: {
    loading: "Loading course",
    dashboard: "Dashboard", content: "Content", resources: "Resources", chat: "Chat", settings: "Settings",
    back: "Back", welcome: "Welcome back", progress: "Course progress",
    readyTitle: "Ready to start?", readyDesc: "Begin your journey and unlock your first lesson.",
    continueTitle: "Continue your learning", continueDesc: (p) => `You have completed ${p}% of this course.`,
    startBtn: "Start course", continueBtn: "Continue", courseContent: "Course content",
    chapters: "chapters", lessonsCompleted: "lessons completed",
    noVideo: "No video available for this lesson", notesPlaceholder: "Write your notes here...",
    saveNote: "Save note", askAi: "Ask AI", schedule: "My schedule", noClasses: "No classes scheduled.",
    name: "Name", email: "Email", theme: "Theme", notifications: "Notifications", edit: "Edit",
    autosave: "Changes are saved automatically.", videoTab: "Video", notesTab: "Notes", brand: "h-tuition",
  },
  french: {
    loading: "Chargement du cours",
    dashboard: "Tableau de bord", content: "Contenu", resources: "Ressources", chat: "Chat", settings: "Réglages",
    back: "Retour", welcome: "Content de te revoir", progress: "Progression du cours",
    readyTitle: "Prêt à commencer ?", readyDesc: "Lancez-vous et débloquez votre première leçon.",
    continueTitle: "Continuez votre apprentissage", continueDesc: (p) => `Vous avez complété ${p}% de ce cours.`,
    startBtn: "Démarrer le cours", continueBtn: "Continuer", courseContent: "Contenu du cours",
    chapters: "chapitres", lessonsCompleted: "leçons terminées",
    noVideo: "Aucune vidéo disponible pour cette leçon", notesPlaceholder: "Écrivez vos notes ici...",
    saveNote: "Enregistrer", askAi: "Demander à l'IA", schedule: "Mon emploi du temps", noClasses: "Aucun cours prévu.",
    name: "Nom", email: "E-mail", theme: "Thème", notifications: "Notifications", edit: "Modifier",
    autosave: "Les modifications sont enregistrées automatiquement.", videoTab: "Vidéo", notesTab: "Notes", brand: "h-tuition",
  },
};

/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
function Dashboardtuition() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") === "french" ? "french" : "english";
  const t = COPY[lang];

  const [activeMenu, setActiveMenu] = useState("dash");
  const [lessonModal, setLessonModal] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [loadingAction, setLoadingAction] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRefs = useRef([]);

  const trigger = useCallback((fn) => {
    timerRefs.current.forEach(clearTimeout);
    setLoadingAction(true);
    setProgress(30);
    timerRefs.current[0] = setTimeout(() => { setProgress(100); fn(); }, 200);
    timerRefs.current[1] = setTimeout(() => { setLoadingAction(false); setProgress(0); }, 500);
  }, []);

  useEffect(() => () => timerRefs.current.forEach(clearTimeout), []);

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [openChapterId, setOpenChapterId] = useState(null);
  const [mySchedule, setMySchedule] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
  const [selectedDay, setSelectedDay] = useState("Wed");
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  const playerRef = useRef(null);

  const allLessons = useMemo(() => chapters.flatMap((ch) => ch.lessons || []), [chapters]);

  const navItems = useMemo(() => [
    { id: "dash", icon: <LayoutDashboard size={18} />, label: t.dashboard },
    { id: "cont", icon: <FileText size={18} />, label: t.content },
    { id: "res", icon: <FolderOpen size={18} />, label: t.resources },
    { id: "chat", icon: <MessageCircle size={18} />, label: t.chat },
  ], [t]);

  const handleNavClick = useCallback((itemId) => trigger(() => setActiveMenu(itemId)), [trigger]);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, chaptersRes, myScheduleRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/chapters-with-progress`),
          api.get("/dashboard/schedule"),
        ]);
        setCourse(courseRes || {});
        const chaptersWithLessons = await Promise.all(
          (chaptersRes || []).map(async (chapter) => {
            const lessonsWithVideos = await Promise.all(
              (chapter.lessons || []).map(async (lesson) => {
                try {
                  const videoRes = await api.get(`/lessons/${lesson.id}/video`);
                  return { ...lesson, video_url: videoRes?.video_url || null };
                } catch { return { ...lesson, video_url: null }; }
              })
            );
            return { ...chapter, lessons: lessonsWithVideos };
          })
        );
        setChapters(chaptersWithLessons);
        if (chaptersWithLessons.length > 0) {
          const firstLesson = chaptersWithLessons[0]?.lessons?.[0];
          if (firstLesson) setCurrentLesson(firstLesson);
          setOpenChapterId(chaptersWithLessons[0]?.chapter_id ?? null);
        }
        setMySchedule(myScheduleRes || {});
      } catch (err) {
        console.error("Error loading course data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    if (!currentLesson?.video_url) return;
    const videoId = getYouTubeId(currentLesson.video_url);
    if (!videoId) return;

    const loadPlayer = () => {
      if (playerRef.current) playerRef.current.destroy();
      playerRef.current = new window.YT.Player("player", {
        videoId, width: "100%", height: "100%",
        playerVars: { controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) nextLesson();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      if (!document.getElementById("youtube-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      if (!window.onYouTubeIframeAPIReadyQueue) window.onYouTubeIframeAPIReadyQueue = [];
      window.onYouTubeIframeAPIReadyQueue.push(loadPlayer);
      window.onYouTubeIframeAPIReady = () => {
        window.onYouTubeIframeAPIReadyQueue.forEach((fn) => fn());
        window.onYouTubeIframeAPIReadyQueue = [];
      };
    }

    return () => {
      if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null; }
    };
  }, [currentLesson]);

  const settingsData = useMemo(() => [
    { label: t.name, value: user?.name || "—", icon: <User size={20} /> },
    { label: t.email, value: user?.email || "—", icon: <Mail size={20} /> },
    { label: t.theme, value: "Passport Dark", icon: <Sun size={20} /> },
    { label: t.notifications, value: lang === "french" ? "Activées" : "Enabled", icon: <Bell size={20} /> },
  ], [t, user, lang]);

  const stopVideo = useCallback(() => { if (playerRef.current) playerRef.current.stopVideo(); }, []);
  const closeVideo = useCallback(() => { setLessonModal(false); stopVideo(); }, [stopVideo]);

  const handleLessonClick = useCallback((lesson) => {
    if (!lesson.video_url) { alert(t.noVideo); return; }
    setCurrentLesson(lesson);
    setActiveTab("video");
    setLessonModal(true);
  }, [t.noVideo]);

  const currentIndex = useMemo(() => allLessons.findIndex((l) => l.id === currentLesson?.id), [allLessons, currentLesson]);
  const hasNext = currentIndex !== -1 && currentIndex < allLessons.length - 1;
  const hasPrev = currentIndex > 0;
  const nextLesson = useCallback(() => hasNext && setCurrentLesson(allLessons[currentIndex + 1]), [hasNext, allLessons, currentIndex]);
  const prevLesson = useCallback(() => hasPrev && setCurrentLesson(allLessons[currentIndex - 1]), [hasPrev, allLessons, currentIndex]);

  const completedLessons = useMemo(() => allLessons.filter((l) => l.completed).length, [allLessons]);
  const totalProgress = allLessons.length ? Math.round((completedLessons / allLessons.length) * 100) : 0;
  const isFirstTime = totalProgress === 0;

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--td-bg,#11152a)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-[2.5px] border-[rgba(255,107,74,0.25)] border-t-[var(--td-coral,#ff6b4a)] animate-spin" />
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--td-muted,#707599)]">
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  /* ── ROOT ── */
  return (
    <div
      className="min-h-screen flex bg-[var(--td-bg,#11152a)] text-[var(--td-text,#f3efe2)] font-[var(--font-body,'Inter',sans-serif)] overflow-x-hidden relative"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 4%, rgba(255,107,74,0.06), transparent 38%), radial-gradient(circle at 95% 2%, rgba(232,179,57,0.05), transparent 42%)",
      }}
    >
      {/* Progress bar */}
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-0.5 bg-[var(--td-coral,#ff6b4a)] z-[9999]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.03 }}
        />
      )}

      {/* ══ DESKTOP SIDEBAR ══ */}
      <aside className="hidden md:flex flex-col justify-between shrink-0 w-16 md:m-6 mr-0 rounded-[22px] border border-[var(--td-border,rgba(245,241,230,0.12))] bg-[var(--td-surface,rgba(245,241,230,0.05))] backdrop-blur-2xl shadow-[var(--td-shadow-lg,0_16px_48px_rgba(0,0,0,0.45))] p-3 self-start sticky top-6 z-40 max-h-[78vh]">
        <div className="flex flex-col gap-4">
          <NavIcon icon={<ArrowLeft size={18} />} onClick={() => navigate(`/course/info/${id}`)} label={t.back} />
          <div className="border-t border-[var(--td-border)] pt-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <NavIcon
                key={item.id}
                icon={item.icon}
                active={activeMenu === item.id}
                onClick={() => handleNavClick(item.id)}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4 border-t border-[var(--td-border)]">
          <NavIcon
            icon={<Settings size={18} />}
            active={activeMenu === "sett"}
            onClick={() => handleNavClick("sett")}
            label={t.settings}
          />
        </div>
      </aside>

      {/* ══ BODY ══ */}
      <div className="flex flex-col flex-1 md:min-w-0 w-full min-w-0">

        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[rgba(17,21,42,0.86)] backdrop-blur-xl border-b border-[var(--td-border,rgba(245,241,230,0.12))] z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <Stamp size={16} color="var(--td-coral,#ff6b4a)" />
            <h2 className="font-[var(--font-display,serif)] font-bold text-[17px] tracking-[-0.02em]">{t.brand}</h2>
          </div>
          <button
            onClick={() => navigate(`/course/info/${id}`)}
            aria-label={t.back}
            className="text-[var(--td-text)] p-2 rounded-full bg-[var(--td-surface)]"
          >
            <ArrowLeft size={18} />
          </button>
        </header>

        {/* Main + schedule row */}
        <div className="flex flex-1 gap-4 md:gap-6 p-3 sm:p-4 md:p-6 overflow-auto pb-24 md:pb-6">

          {/* ══ MAIN ══ */}
          <main className="flex flex-col gap-4 md:gap-6 flex-1 min-w-0 relative z-10">

            {/* ── DASHBOARD ── */}
            {activeMenu === "dash" && (
              <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[680px] mx-auto">

                {/* Hero card */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--td-border,rgba(245,241,230,0.12))] bg-[var(--td-surface,rgba(245,241,230,0.05))] backdrop-blur-xl p-4 sm:p-5 md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] md:text-[10.5px] uppercase tracking-[0.2em] text-[var(--td-coral,#ff6b4a)] mb-2">
                        {t.welcome}
                      </p>
                      <h1 className="font-[var(--font-display,serif)] text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-[-0.02em] mb-2 truncate">
                        {user?.name || "Learner"}
                      </h1>
                      <h2 className="text-[var(--td-coral,#ff6b4a)] text-sm md:text-base font-bold mb-2 line-clamp-1">
                        {course?.title ? course.title.substring(0, 48) : ""}
                      </h2>
                      <p className="text-[var(--td-sub,#aeb1c9)] text-[12.5px] md:text-[13.5px] leading-relaxed line-clamp-3">
                        {course?.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <ProgressOrbit value={totalProgress} size={80} />
                      <span className="font-mono text-[9px] md:text-[9.5px] uppercase tracking-[0.16em] text-[var(--td-muted,#707599)]">
                        {t.progress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Continue / Start card */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--td-border-med,rgba(245,241,230,0.22))] bg-[var(--td-surface,rgba(245,241,230,0.05))] backdrop-blur-xl p-4 sm:p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--td-coral-soft,rgba(255,107,74,0.12))] flex items-center justify-center text-[var(--td-coral,#ff6b4a)] shrink-0">
                      {isFirstTime ? <Sparkles size={20} /> : <Play size={18} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[14px] md:text-[15.5px]">
                        {isFirstTime ? t.readyTitle : t.continueTitle}
                      </h3>
                      <p className="text-[var(--td-sub,#aeb1c9)] text-[12px] md:text-[13px] mt-0.5 line-clamp-2">
                        {isFirstTime ? t.readyDesc : t.continueDesc(totalProgress)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      trigger(() => {
                        setCurrentLesson(allLessons[0]);
                        setActiveTab("video");
                        setLessonModal(true);
                      })
                    }
                    className="shrink-0 w-full sm:w-auto bg-[var(--td-coral,#ff6b4a)] px-5 py-2.5 md:px-[22px] md:py-[11px] rounded-[13px] font-bold text-[13px] md:text-sm text-[#11152a] border-none cursor-pointer shadow-[var(--td-shadow-coral,0_8px_28px_rgba(255,107,74,0.3))] transition-opacity hover:opacity-90"
                  >
                    {isFirstTime ? t.startBtn : t.continueBtn}
                  </button>
                </div>

                {/* Mobile Schedule — inline on dashboard */}
                <div className="lg:hidden rounded-2xl bg-[var(--td-surface)] backdrop-blur-xl border border-[var(--td-border)] p-4">
                  <h3 className="font-bold text-[14px] mb-3">{t.schedule}</h3>
                  <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
                    {Object.keys(mySchedule).map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-2.5 py-1.5 rounded-[9px] font-mono text-[11px] border-none cursor-pointer transition-colors shrink-0 ${
                          day === selectedDay
                            ? "bg-[var(--td-coral)] text-[#11152a] font-bold"
                            : "bg-transparent text-[var(--td-muted)] font-medium"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 min-h-[60px]">
                    {(mySchedule[selectedDay] || []).length > 0 ? (
                      mySchedule[selectedDay].map(({ time, class: className }, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="font-mono text-[9.5px] text-[var(--td-muted)] uppercase tracking-[0.1em]">{time}</span>
                          <div className="bg-[var(--td-coral-soft)] border border-[rgba(255,107,74,0.25)] rounded-[11px] p-2.5 text-[13px]">
                            {className}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[var(--td-muted)] text-[13px]">{t.noClasses}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── CONTENT ── */}
            {activeMenu === "cont" && (
              <div className="flex flex-col gap-5 md:gap-7">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-[var(--font-display,serif)] text-[22px] md:text-[28px] font-bold tracking-[-0.02em]">
                    {t.courseContent}
                  </h2>
                  <div className="font-mono text-[11px] text-[var(--td-muted,#707599)] bg-[var(--td-surface)] px-3 py-1.5 rounded-[10px] border border-[var(--td-border)] shrink-0">
                    {chapters.length} {t.chapters}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {chapters.map((chapter, chIdx) => {
                    const isOpen = openChapterId === chapter.chapter_id;
                    const chapterLessons = chapter.lessons || [];
                    const chapterDone = chapterLessons.filter((l) => l.completed).length;

                    return (
                      <div
                        key={chapter.chapter_id}
                        className="relative overflow-hidden rounded-[18px] md:rounded-[20px] border border-[var(--td-border)] bg-[var(--td-surface)] backdrop-blur-xl"
                      >
                        <button
                          onClick={() => setOpenChapterId(isOpen ? null : chapter.chapter_id)}
                          className="w-full flex items-center justify-between gap-3 md:gap-4 p-4 md:p-5 text-left bg-transparent border-none text-inherit cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-[10px] md:text-[11px] text-[var(--td-coral,#ff6b4a)] bg-[var(--td-coral-soft)] w-7 h-7 md:w-8 md:h-8 rounded-[9px] md:rounded-[10px] flex items-center justify-center shrink-0">
                              {String(chIdx + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-[13.5px] md:text-[15px] font-bold truncate">{chapter.chapter_title}</h3>
                              <p className="text-[11px] md:text-[11.5px] text-[var(--td-muted,#707599)] mt-0.5">
                                {chapterDone}/{chapterLessons.length} {t.lessonsCompleted}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-[var(--td-muted)] shrink-0 transition-transform duration-300"
                            style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
                          />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-2 px-3 md:px-5 pb-4 md:pb-5">
                                {chapterLessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson)}
                                    className="flex items-center gap-3 p-3 md:p-3.5 rounded-xl md:rounded-2xl border border-[var(--td-border)] cursor-pointer transition-all duration-300 bg-[rgba(245,241,230,0.02)] hover:border-[var(--td-coral)] hover:bg-[var(--td-coral-soft)] active:scale-[0.98]"
                                  >
                                    <div className="shrink-0">
                                      {lesson.completed
                                        ? <CheckCircle2 size={18} color="var(--td-teal,#45c2a6)" />
                                        : <Circle size={18} color="var(--td-muted,#707599)" />
                                      }
                                    </div>
                                    <p className="flex-1 min-w-0 text-[12.5px] md:text-[13.5px] font-semibold truncate">
                                      {lesson.title}
                                    </p>
                                    <div className="w-[28px] h-[28px] md:w-[30px] md:h-[30px] rounded-[9px] md:rounded-[10px] bg-[var(--td-surface-solid)] flex items-center justify-center text-[var(--td-coral)] shrink-0">
                                      <Play size={11} fill="currentColor" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── RESOURCES ── */}
            {activeMenu === "res" && (
              <div className="flex flex-col gap-5 md:gap-7">
                <h2 className="font-[var(--font-display,serif)] text-[22px] md:text-[28px] font-bold tracking-[-0.02em]">
                  {t.resources}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {[
                    { name: "VS Code", url: "https://code.visualstudio.com/", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2sWIwNrqZXnmkybebuof7BX841YTGYh_5jg&s" },
                    { name: "Android Studio", url: "https://developer.android.com/studio", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuJu7V-_10eRWGv3tuFzBZpgY-xqx-Au9ANA&s" },
                    { name: "Git Bash", url: "https://gitforwindows.org/", logo: "https://w7.pngwing.com/pngs/155/858/png-transparent-git-icon-hd-logo-thumbnail.png" },
                    { name: "Node.js", url: "https://nodejs.org/", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYd8F6_lR43_eimQ9FXJ_Gk_sru5JjzGdkTw&s" },
                    { name: "Python", url: "https://www.python.org/downloads/", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYRIF1-r3PX2Cz3NzA7UGU3HjgaUnF6gHk6w&s" },
                  ].map((res) => (
                    <a
                      key={res.name}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative overflow-hidden rounded-[18px] md:rounded-[20px] border border-[var(--td-border)] bg-[var(--td-surface)] backdrop-blur-xl p-4 md:p-[22px] flex flex-col items-center justify-center no-underline text-inherit transition-all duration-300 hover:border-[var(--td-coral)] hover:-translate-y-1 active:scale-[0.97]"
                    >
                      <img src={res.logo} alt={res.name} className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl object-cover mb-2 md:mb-3" />
                      <p className="font-bold text-[12px] md:text-[13px] text-center">{res.name}</p>
                      <span className="mt-1 md:mt-1.5 text-[var(--td-coral)] text-[10.5px] md:text-[11.5px] font-bold">
                        {lang === "french" ? "Télécharger →" : "Download →"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {activeMenu === "sett" && (
              <div className="flex flex-col gap-5 md:gap-7 max-w-[640px] mx-auto py-4 md:py-6 w-full">
                <h2 className="font-[var(--font-display,serif)] text-[22px] md:text-[28px] font-bold tracking-[-0.02em]">
                  {t.settings}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settingsData.map((setting, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-4 md:p-[18px] rounded-xl md:rounded-2xl bg-[var(--td-surface)] backdrop-blur-xl border border-[var(--td-border)]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 md:w-[42px] md:h-[42px] rounded-[11px] md:rounded-[13px] bg-[var(--td-coral-soft)] flex items-center justify-center text-[var(--td-coral)] shrink-0">
                          {setting.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10.5px] md:text-[11px] text-[var(--td-muted)]">{setting.label}</p>
                          <p className="text-[13px] md:text-[13.5px] font-bold truncate">{setting.value}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 md:px-3.5 md:py-2 text-[11px] md:text-[11.5px] font-bold rounded-[9px] md:rounded-[10px] bg-[var(--td-surface-solid)] border border-[var(--td-border)] text-[var(--td-text)] cursor-pointer shrink-0">
                        {t.edit}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[11px] md:text-[11.5px] text-[var(--td-muted)] font-[var(--font-stamp)]">
                  {t.autosave}
                </p>
              </div>
            )}

            {/* ── CHAT ── */}
            {activeMenu === "chat" && (
              <div className="rounded-2xl md:rounded-3xl border border-[var(--td-border)] bg-[var(--td-surface)] backdrop-blur-xl overflow-hidden h-[calc(100vh-160px)] md:h-auto">
                <ChatCourseAi topic={course?.title} onClick={() => setActiveMenu("dash")} />
              </div>
            )}
          </main>

          {/* ══ RIGHT PANEL: SCHEDULE (desktop only) ══ */}
          {activeMenu === "dash" && (
            <aside className="hidden lg:flex flex-col gap-5 w-[260px] xl:w-[280px] shrink-0">
              <div className="rounded-[22px] bg-[var(--td-surface)] backdrop-blur-xl border border-[var(--td-border)] p-5 md:p-[22px]">
                <h3 className="font-bold text-[14.5px] mb-3.5">{t.schedule}</h3>

                <div className="flex gap-1.5 mb-[18px] flex-wrap">
                  {Object.keys(mySchedule).map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-2.5 py-1.5 rounded-[9px] font-mono text-[11px] border-none cursor-pointer transition-colors ${
                        day === selectedDay
                          ? "bg-[var(--td-coral)] text-[#11152a] font-bold"
                          : "bg-transparent text-[var(--td-muted)] font-medium"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5 min-h-[100px]">
                  {(mySchedule[selectedDay] || []).length > 0 ? (
                    mySchedule[selectedDay].map(({ time, class: className }, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="font-mono text-[9.5px] text-[var(--td-muted)] uppercase tracking-[0.1em]">{time}</span>
                        <div className="bg-[var(--td-coral-soft)] border border-[rgba(255,107,74,0.25)] rounded-[11px] p-2.5 text-[13px]">
                          {className}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[var(--td-muted)] text-[13px]">{t.noClasses}</p>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <aside className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--td-surface-solid,#1a2040)] backdrop-blur-2xl border border-[var(--td-border,rgba(245,241,230,0.12))] px-3 py-2.5 rounded-[20px] shadow-[var(--td-shadow-lg,0_16px_48px_rgba(0,0,0,0.45))] z-50">
        {navItems.map((item) => (
          <NavIcon key={item.id} icon={item.icon} active={activeMenu === item.id} onClick={() => handleNavClick(item.id)} label={item.label} />
        ))}
        <NavIcon icon={<Settings size={18} />} active={activeMenu === "sett"} onClick={() => handleNavClick("sett")} label={t.settings} />
      </aside>

      {/* ══ LESSON MODAL ══ */}
      <AnimatePresence>
        {lessonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-[rgba(7,9,20,0.82)] backdrop-blur-xl p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-[860px] bg-[var(--td-surface-solid)] sm:rounded-[22px] rounded-t-[22px] overflow-hidden border border-[var(--td-border-med)] shadow-[var(--td-shadow-lg)] max-h-[95dvh] flex flex-col"
            >
              {/* Drag handle on mobile */}
              <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[var(--td-border-med)]" />
              </div>

              <button
                onClick={closeVideo}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 text-[var(--td-text)] bg-[var(--td-surface)] p-1.5 sm:p-2 rounded-full border border-[var(--td-border)] cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Tabs */}
              <div className="flex border-b border-[var(--td-border)] shrink-0">
                {["video", "notes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-center font-bold text-[13px] md:text-[13.5px] relative bg-transparent border-none cursor-pointer transition-colors ${
                      activeTab === tab ? "text-[var(--td-text)]" : "text-[var(--td-muted)]"
                    }`}
                  >
                    {tab === "video" ? `🎥 ${t.videoTab}` : `📝 ${t.notesTab}`}
                    {activeTab === tab && (
                      <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--td-coral)]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-3 sm:p-4 flex flex-col gap-4 overflow-y-auto">
                {activeTab === "video" && (
                  currentLesson?.video_url ? (
                    <VideoPlayer
                      key={currentLesson.id}
                      url={currentLesson.video_url}
                      nextLesson={nextLesson}
                      prevLesson={prevLesson}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 text-[var(--td-muted)]">
                      {t.noVideo}
                    </div>
                  )
                )}

                {activeTab === "notes" && (
                  <div className="flex flex-col gap-3">
                    <textarea
                      placeholder={t.notesPlaceholder}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full h-40 sm:h-48 bg-[var(--td-surface)] border border-[var(--td-border)] rounded-2xl p-3.5 text-[var(--td-text)] outline-none resize-none text-[13.5px]"
                    />
                    <div className="flex justify-end items-center gap-2.5">
                      <button className="bg-[var(--td-teal)] text-[#11152a] px-4 py-2.5 rounded-xl font-bold text-[13px] border-none cursor-pointer">
                        {t.saveNote}
                      </button>
                      <button
                        onClick={() => { closeVideo(); setActiveMenu("chat"); }}
                        className="bg-[var(--td-coral)] text-[#11152a] px-4 py-2.5 rounded-xl font-bold text-[13px] border-none cursor-pointer"
                      >
                        {t.askAi}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboardtuition;

/* ══════════════════════════════════════════════════════════════
   VIDEO PLAYER
══════════════════════════════════════════════════════════════ */
const VideoPlayer = React.memo(function VideoPlayer({ url, nextLesson, prevLesson }) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);

  const handleFullScreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  }, []);

  const videoId = getYouTubeId(url);
  const iframeUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`
    : url;

  return (
    <div
      ref={containerRef}
      className="relative rounded-[16px] md:rounded-[18px] overflow-hidden bg-black w-full aspect-video border border-[var(--td-border-med)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <iframe
        src={iframeUrl}
        title="Lesson Video"
        className="w-full h-full border-none"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      />

      <div
        className="absolute inset-0 flex justify-between items-center px-3 md:px-4 transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none" }}
      >
        <button
          onClick={prevLesson}
          className="bg-[rgba(0,0,0,0.6)] text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] cursor-pointer text-sm"
        >←</button>
        <button
          onClick={nextLesson}
          className="bg-[var(--td-coral)] text-[#11152a] px-3 py-2 md:px-4 md:py-2.5 rounded-xl border-none cursor-pointer font-bold text-sm"
        >→</button>
      </div>

      <button
        onClick={handleFullScreen}
        className="absolute top-3 right-3 bg-[rgba(0,0,0,0.6)] text-white p-1.5 md:p-2 rounded-full border border-[rgba(255,255,255,0.1)] cursor-pointer transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none" }}
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
});