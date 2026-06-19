import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router";
import api from "../services/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, X,
  LayoutDashboard, FileText, FolderOpen, MessageCircle, Settings,
  Play, CheckCircle2, Circle, ChevronRight, User, Mail, Sun, Bell,
  Sparkles, Maximize2,
} from "lucide-react";
import AvilaAI from "../Components/AvilaAI";
import ReactPlayer from "react-player";
import useTriggerWithProgress from "../hooks/triggerWithProgress";
import ChatCourseAi from "../Components/ChatCourseAi";
import NavIcon from "./Admin/components/NavIcon";
import ProgressOrbit from "./Progressorbit";

function Course() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("dash");
  const [lessonModal, setLessonModal] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [openAvila, setOpenAvila] = useState(false);
  const { loadingAction, progress, trigger } = useTriggerWithProgress();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [openChapterId, setOpenChapterId] = useState(null);
  const [mySchedule, setMySchedule] = useState({
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [],
  });
  const [selectedDay, setSelectedDay] = useState("Wed");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const allLessons = chapters.flatMap(ch => ch.lessons || []);

  // ── Nav items ─────────────────────────────────────────────────
  const navItems = [
    { id: "dash", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { id: "cont", icon: <FileText size={18} />, label: "Content" },
    { id: "res", icon: <FolderOpen size={18} />, label: "Resources" },
    { id: "chat", icon: <MessageCircle size={18} />, label: "Chat" },
  ];

  const handleNavClick = (itemId) => {
    trigger(() => {
      setActiveMenu(itemId);
      if (itemId === "chat") setOpenAvila(true);
    });
  };

  // ── Charger les données du cours ─────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, chaptersRes, myScheduleRes, statsRes] =
          await Promise.all([
            api.get(`/courses/${id}`),
            api.get(`/courses/${id}/chapters-with-progress`),
            api.get("/dashboard/schedule"),
            api.get(`/courses/${id}/stats`),
          ]);

        setCourse(courseRes || {});
        const chaptersWithLessons = await Promise.all(
          (chaptersRes || []).map(async (chapter) => {
            const lessonsWithVideos = await Promise.all(
              (chapter.lessons || []).map(async (lesson) => {
                try {
                  const videoRes = await api.get(`/lessons/${lesson.id}/video`);
                  return { ...lesson, video_url: videoRes?.video_url || null };
                } catch {
                  return { ...lesson, video_url: null };
                }
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
        setStats(statsRes || {});
      } catch (err) {
        console.error("Error loading course data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // ── YouTube player ────────────────────────────────────────────
  useEffect(() => {
    if (!currentLesson?.video_url) return;

    const videoId = getYouTubeId(currentLesson.video_url);
    if (!videoId) return;

    const loadPlayer = () => {
      if (playerRef.current) playerRef.current.destroy();

      playerRef.current = new window.YT.Player("player", {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: { controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
            setPlaying(false);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setPlaying(true);
            else setPlaying(false);
            if (event.data === window.YT.PlayerState.ENDED) nextLesson();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) loadPlayer();
    else {
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
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [currentLesson]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        handleTimeUpdate();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentLesson]);

  const settingsData = [
    { label: "Name", value: user?.name || "Your Name", icon: <User size={20} /> },
    { label: "Email", value: user?.email || "user@example.com", icon: <Mail size={20} /> },
    { label: "Theme", value: "Dark", icon: <Sun size={20} /> },
    { label: "Notifications", value: "Enabled", icon: <Bell size={20} /> },
  ];

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || !player.getCurrentTime) return;
  };

  const stopVideo = () => {
    if (!playerRef.current) return;
    playerRef.current.stopVideo();
    setPlaying(false);
  };

  const handleLessonClick = (lesson) => {
    if (!lesson.video_url) {
      alert("Video not available yet");
      return;
    }
    setCurrentLesson(lesson);
    setActiveTab("video");
    setLessonModal(true);
    setTimeout(() => {
      const iframe = document.querySelector("iframe");
      if (iframe) iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*");
    }, 300);
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const closeVideo = () => { setLessonModal(false); stopVideo(); };

  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const hasNext = currentIndex !== -1 && currentIndex < allLessons.length - 1;
  const hasPrev = currentIndex > 0;
  const nextLesson = () => hasNext && setCurrentLesson(allLessons[currentIndex + 1]);
  const prevLesson = () => hasPrev && setCurrentLesson(allLessons[currentIndex - 1]);

  const completedLessons = allLessons.filter(l => l.completed).length;
  const totalProgress = allLessons.length
    ? Math.round((completedLessons / allLessons.length) * 100)
    : 0;
  const isFirstTime = totalProgress === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#7c5cff]/30 border-t-[#7c5cff] animate-spin" />
          <p className="text-[#6b7280] font-mono text-xs tracking-widest uppercase">Loading course</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e8eaf0] font-[Inter,sans-serif] flex flex-col md:flex-row relative overflow-x-hidden">

      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7c5cff]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#22d3a8]/6 rounded-full blur-3xl" />
      </div>

      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-0.5 bg-linear-to-r from-[#7c5cff] to-[#22d3a8] z-9999"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.03 }}
        />
      )}

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0f1320]/80 backdrop-blur-xl border-b border-white/6 relative z-10">
        <h2 className="font-[Space_Grotesk,sans-serif] text-[#7c5cff] font-bold text-lg tracking-tight">h-learning</h2>
        <button
          onClick={() => navigate(`/course/info/${id}`)}
          aria-label="Back"
          className="text-[#e8eaf0] p-2 rounded-full hover:bg-white/6 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </header>

      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="hidden md:fixed md:flex left-6 top-24 flex-col justify-between bg-[#0f1320]/80 backdrop-blur-2xl border border-white/8 p-3 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] z-40 h-[78vh]">
        <div className="flex flex-col gap-4">
          <NavIcon icon={<ArrowLeft size={18} />} onClick={() => navigate(`/course/info/${id}`)} label="Back" />
          <div className="border-t border-white/8 pt-4 flex flex-col gap-4">
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
        <div className="flex flex-col gap-4 pt-4 border-t border-white/8">
          <NavIcon
            icon={<Settings size={18} />}
            active={activeMenu === "sett"}
            onClick={() => handleNavClick("sett")}
            label="Settings"
          />
        </div>
      </aside>

      {/* ============ MOBILE SIDEBAR ============ */}
      <aside className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#0f1320]/90 backdrop-blur-2xl border border-white/8 px-4 py-3 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] z-50">
        {navItems.map((item) => (
          <NavIcon
            key={item.id}
            icon={item.icon}
            active={activeMenu === item.id}
            onClick={() => handleNavClick(item.id)}
            label={item.label}
          />
        ))}
        <NavIcon
          icon={<Settings size={18} />}
          active={activeMenu === "sett"}
          onClick={() => handleNavClick("sett")}
          label="Settings"
        />
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 p-6 md:p-8 md:pl-32 flex flex-col md:flex-row gap-6 md:gap-8 overflow-auto relative z-10">

        <section className={`flex-1 flex flex-col gap-6 ${activeMenu === 'dash' && "max-w-full md:max-w-2xl"}`}>

          {/* ================= DASHBOARD ================= */}
          {activeMenu === "dash" && (
            <>
              {/* HERO */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0f1320]/60 backdrop-blur-xl border border-white/8 p-7 md:p-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#7c5cff]/12 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7c5cff] mb-3">
                      Welcome back
                    </p>
                    <h1 className="font-[Space_Grotesk,sans-serif] text-2xl md:text-3xl font-bold text-[#e8eaf0] mb-4 tracking-tight">
                      {user?.name || "Learner"}
                    </h1>
                    <h2 className="text-[#7c5cff] text-lg font-semibold mb-2">
                      {course?.title ? `${course.title.substring(0, 40)}` : ""}
                    </h2>
                    <p className="text-[#6b7280] text-sm leading-relaxed max-w-md">
                      {course?.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <ProgressOrbit value={totalProgress} size={104} />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                      Course progress
                    </span>
                  </div>
                </div>
              </div>

              {/* CONTINUE / START CARD */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0f1320]/60 backdrop-blur-xl border border-[#7c5cff]/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="absolute inset-0 bg-linear-to-br from-[#7c5cff]/6 via-transparent to-[#22d3a8]/4" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7c5cff]/15 flex items-center justify-center text-[#7c5cff] shrink-0">
                    {isFirstTime ? <Sparkles size={22} /> : <Play size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#e8eaf0] text-base">
                      {isFirstTime ? "Ready to start?" : "Continue your learning"}
                    </h3>
                    <p className="text-[#6b7280] text-sm mt-0.5">
                      {isFirstTime
                        ? "Begin your journey and unlock your first lesson."
                        : `You have completed ${totalProgress}% of this course.`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => trigger(() => { setCurrentLesson(allLessons[0]); setActiveTab("video"); setLessonModal(true); })}
                  className="relative shrink-0 bg-[#7c5cff] hover:bg-[#6b4ce8] transition-all px-6 py-2.5 rounded-xl font-semibold text-white shadow-[0_8px_24px_-4px_rgba(124,92,255,0.5)] hover:shadow-[0_8px_32px_-4px_rgba(124,92,255,0.7)] hover:-translate-y-0.5"
                >
                  {isFirstTime ? "Start Course" : "Continue"}
                </button>
              </div>
            </>
          )}

          {/* ================= CONTENT ================= */}
          {activeMenu === "cont" && (
            <div className="flex flex-col gap-8 px-1 md:px-0">

              <div className="flex items-center justify-between">
                <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold text-[#e8eaf0] tracking-tight">
                  Course Content
                </h2>
                <div className="font-mono text-xs text-[#6b7280] bg-white/4 px-3 py-1.5 rounded-xl border border-white/8">
                  {chapters.length} chapters
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {chapters.map((chapter, chIdx) => {
                  const isOpen = openChapterId === chapter.chapter_id;
                  const chapterLessons = chapter.lessons || [];
                  const chapterDone = chapterLessons.filter(l => l.completed).length;

                  return (
                    <div
                      key={chapter.chapter_id}
                      className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#0f1320]/60 backdrop-blur-xl transition-all duration-500"
                    >
                      {/* Chapter header (clickable) */}
                      <button
                        onClick={() => setOpenChapterId(isOpen ? null : chapter.chapter_id)}
                        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/2 transition"
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-[#7c5cff] bg-[#7c5cff]/10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                            {String(chIdx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="text-lg font-bold text-[#e8eaf0]">
                              {chapter.chapter_title}
                            </h3>
                            <p className="text-xs text-[#6b7280] mt-1">
                              {chapterDone}/{chapterLessons.length} lessons completed
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`text-[#6b7280] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* Lessons (collapsible) */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-2 px-6 pb-6">
                              {chapterLessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(lesson)}
                                  className="group flex items-center gap-4 p-3.5 rounded-2xl bg-white/2 border border-white/6 hover:border-[#7c5cff]/30 hover:bg-[#7c5cff]/4 cursor-pointer transition-all duration-300"
                                >
                                  <div className="shrink-0">
                                    {lesson.completed
                                      ? <CheckCircle2 size={20} className="text-[#22d3a8]" />
                                      : <Circle size={20} className="text-[#6b7280] group-hover:text-[#7c5cff] transition" />
                                    }
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-[#e8eaf0] font-medium text-sm truncate">
                                      {lesson.title}
                                    </p>
                                  </div>

                                  <div className="w-8 h-8 rounded-xl bg-white/4 flex items-center justify-center text-[#6b7280] group-hover:bg-[#7c5cff] group-hover:text-white transition shrink-0">
                                    <Play size={13} fill="currentColor" />
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

          {/* ================= RESOURCES ================= */}
          {activeMenu === "res" && (
            <div className="flex flex-col gap-8 px-1 md:px-0">

              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold text-[#e8eaf0] tracking-tight">
                Resources
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
                    className="group relative overflow-hidden rounded-3xl border border-white/8 bg-[#0f1320]/60 backdrop-blur-xl p-6 flex flex-col items-center justify-center hover:border-[#7c5cff]/30 hover:-translate-y-1.5 transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-[#7c5cff]/8 via-transparent to-[#22d3a8]/5 opacity-0 group-hover:opacity-100 transition" />
                    <img
                      src={res.logo}
                      alt={res.name}
                      className="w-16 h-16 rounded-2xl object-cover mb-4 transition-transform duration-300 group-hover:scale-110 relative z-10"
                    />
                    <p className="text-[#e8eaf0] font-semibold text-sm relative z-10">{res.name}</p>
                    <span className="mt-2 text-[#7c5cff] text-xs font-semibold group-hover:text-[#9b85ff] relative z-10">
                      Download →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ================= SETTINGS ================= */}
          {activeMenu === "sett" && (
            <div className="flex flex-col gap-8 px-1 md:px-0 max-w-3xl mx-auto py-6">

              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold text-[#e8eaf0] tracking-tight">
                Settings
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settingsData.map((setting, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-[#0f1320]/60 backdrop-blur-xl border border-white/8 hover:border-[#7c5cff]/20 transition-all duration-300"
                  >
                    <div className="flex items-start sm:items-center gap-4 w-full">
                      <div className="w-11 h-11 rounded-xl bg-[#7c5cff]/10 flex items-center justify-center text-[#7c5cff] shrink-0">
                        {setting.icon}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[#6b7280] text-xs">{setting.label}</p>
                        <p className="text-[#e8eaf0] font-semibold text-sm truncate">{setting.value}</p>
                      </div>
                    </div>
                    <button className="mt-3 sm:mt-0 px-4 py-2 bg-white/4 hover:bg-[#7c5cff] text-[#e8eaf0] text-xs font-medium rounded-xl border border-white/8 hover:border-[#7c5cff] transition-all duration-300 shrink-0">
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[#6b7280] text-sm text-center font-mono mt-2">
                Changes are saved automatically.
              </p>
            </div>
          )}

          {/* ================= CHAT ================= */}
          {activeMenu === "chat" && (
            <div className="rounded-3xl border border-white/8 bg-[#0f1320]/60 backdrop-blur-xl lg:mx-0 mx-auto w-full overflow-hidden">
              <ChatCourseAi topic={course?.title} onClick={() => setActiveMenu('dash')} />
            </div>
          )}

        </section>

        {/* ================= RIGHT PANEL: SCHEDULE ================= */}
        {activeMenu === "dash" && (
          <aside className="w-full md:w-72 flex flex-col gap-6 max-w-full">
            <div className="rounded-3xl bg-[#0f1320]/60 backdrop-blur-xl border border-white/8 p-6">
              <h3 className="font-semibold text-[#e8eaf0] mb-4">My schedule</h3>

              <div className="flex gap-1.5 mb-5 text-xs flex-wrap">
                {Object.keys(mySchedule).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-2.5 py-1.5 rounded-lg font-mono transition ${
                      day === selectedDay
                        ? "bg-[#7c5cff] text-white shadow-[0_4px_12px_-2px_rgba(124,92,255,0.5)]"
                        : "text-[#6b7280] hover:bg-white/6"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 min-h-25">
                {(mySchedule[selectedDay] || []).length > 0 ? (
                  mySchedule[selectedDay].map(({ time, class: className }, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] text-[#6b7280] uppercase tracking-wide">{time}</span>
                      <div className="bg-[#7c5cff]/10 border border-[#7c5cff]/20 text-[#e8eaf0] rounded-xl p-2.5 text-sm">
                        {className}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#6b7280] text-sm">No classes scheduled.</p>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* ================= LESSON MODAL ================= */}
        <AnimatePresence>
          {lessonModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-4xl bg-[#0f1320] rounded-3xl shadow-[0_30px_90px_-20px_rgba(124,92,255,0.25)] overflow-hidden border border-white/8"
              >
                <button
                  onClick={closeVideo}
                  className="absolute top-5 right-5 z-50 text-[#e8eaf0] bg-white/6 p-2 rounded-full hover:bg-white/12 transition-all hover:scale-110"
                >
                  <X size={22} />
                </button>

                {/* Tabs */}
                <div className="flex border-b border-white/8 bg-[#0a0c12]">
                  {["video", "notes"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3.5 text-center font-semibold text-sm transition-all relative ${
                        activeTab === tab ? "text-[#e8eaf0]" : "text-[#6b7280] hover:text-[#e8eaf0]"
                      }`}
                    >
                      {tab === "video" ? "🎥 Video" : "📝 Notes"}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="tabIndicator"
                          className={`absolute bottom-0 left-0 right-0 h-0.75 ${
                            tab === "video" ? "bg-[#7c5cff]" : "bg-[#22d3a8]"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 flex flex-col gap-6">
                  {activeTab === "video" && (
                    currentLesson?.video_url ? (
                      <VideoPlayer
                        key={currentLesson.id}
                        url={currentLesson.video_url}
                        nextLesson={nextLesson}
                        prevLesson={prevLesson}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-60 text-[#6b7280]">
                        No video available for this lesson
                      </div>
                    )
                  )}

                  {activeTab === "notes" && (
                    <div className="flex flex-col gap-4">
                      <textarea
                        placeholder="Write your notes here..."
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full h-56 bg-white/3 border border-white/8 rounded-2xl p-4 text-[#e8eaf0] outline-none resize-none focus:border-[#7c5cff]/40 transition-all duration-300 placeholder:text-[#6b7280]"
                      />
                      <div className="flex justify-end items-center gap-3">
                        <button className="bg-[#22d3a8] hover:bg-[#1bbd95] text-[#08090d] px-5 py-2.5 rounded-xl font-semibold text-sm transition-transform hover:scale-105 shadow-[0_8px_24px_-4px_rgba(34,211,168,0.4)]">
                          Save Note
                        </button>
                        <button
                          onClick={() => setActiveMenu("chat")}
                          className="bg-[#7c5cff] hover:bg-[#6b4ce8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-transform hover:scale-105 shadow-[0_8px_24px_-4px_rgba(124,92,255,0.4)]"
                        >
                          Ask AI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default Course;

/* ================= VIDEO PLAYER ================= */
function VideoPlayer({ url, nextLesson, prevLesson }) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);

  const handleFullScreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };

  const getYouTubeId = (link) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(url);
  const iframeUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`
    : url;

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden bg-black w-full aspect-video shadow-2xl border border-white/8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <iframe
        src={iframeUrl}
        title="Lesson Video"
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      />

      <div className={`absolute inset-0 flex justify-between items-center px-4 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={prevLesson}
          className="bg-black/60 backdrop-blur text-white px-4 py-2.5 rounded-xl hover:bg-[#7c5cff] transition-all hover:scale-110 border border-white/10"
        >
          ←
        </button>
        <button
          onClick={nextLesson}
          className="bg-[#7c5cff]/90 backdrop-blur text-white px-4 py-2.5 rounded-xl hover:bg-[#7c5cff] transition-all hover:scale-110 shadow-[0_8px_24px_-4px_rgba(124,92,255,0.6)]"
        >
          →
        </button>
      </div>

      <button
        onClick={handleFullScreen}
        className={`absolute top-4 right-4 bg-black/60 backdrop-blur text-white p-2 rounded-full hover:bg-[#7c5cff] transition-all duration-300 border border-white/10 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}