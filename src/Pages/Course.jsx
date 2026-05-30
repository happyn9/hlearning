import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router";
import api from "../services/api";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Play, X } from "lucide-react";
import AvilaAI from "../Components/AvilaAI";
import ReactPlayer from "react-player";
import useTriggerWithProgress from "../hooks/triggerWithProgress";
import ChatCourseAi from "../Components/ChatCourseAi";
import { User, Mail, Sun, Bell } from "lucide-react";

const userinfo = {
  name: "Johnny",
  avatar: "https://i.pravatar.cc/150?img=12",
  role: "Learner",
  descriptions: [
    "Get it by the end of this lesson",
    "Build real projects",
    "Become a Professional",
  ],
};

function Course() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dash");
  const [lessonModal, setLessonModal] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [openAvila,setOpenAvila]=useState(false)
  const { loadingAction, progress, trigger } = useTriggerWithProgress();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
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

  // Charger les données du cours
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

  // Initialiser le lecteur YouTube
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
            setProgress(0);
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

  // Mettre à jour le progrès de la vidéo
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        handleTimeUpdate();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentLesson]);

  const settingsData = [
    { label: "Name", value: user?.name || "Your Name", icon: <User size={28} className="text-indigo-500" /> },
    { label: "Email", value: user?.email || "user@example.com", icon: <Mail size={28} className="text-indigo-500" /> },
    { label: "Theme", value: "Dark", icon: <Sun size={28} className="text-indigo-500" /> },
    { label: "Notifications", value: "Enabled", icon: <Bell size={28} className="text-indigo-500" /> },
  ];


  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || !player.getCurrentTime) return;
    setProgress(player.getCurrentTime());
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

  const saveNote = () => console.log("Saved note:", noteContent);
  const closeVideo = () => {setLessonModal(false); stopVideo(); };

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

  if (loading) return <p className="bg-black h-screen text-white p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0c1824] text-white font-sans flex flex-col md:flex-row">
      {loadingAction && (
      <motion.div
        className="fixed top-0 left-0 h-1 bg-neutral-600 z-9999"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.03 }}
      />
    )}

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0f1f35]">
        <h2 className="text-blue-500 font-bold text-lg">h-learning</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar" className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`bg-[#0f1f35] p-6 flex flex-col gap-8 select-none fixed top-0 left-0 h-full w-60 z-50 transform transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <span onClick={() => navigate(`/course/info/${id}`)} className="absolute right-4 cursor-pointer hover:text-gray-400 border p-3 rounded-full top-5">
          <ArrowLeft />
        </span>
        <h2 className="text-blue-500 font-bold text-lg hidden md:block">h-learning</h2>
        <nav className="flex flex-col gap-4">
          {[
            { key: "dash", label: "Dashboard",d:'M3 3h18v18H3z' },
            { key: "cont", label: "Content", d:'M3 10h18M3 14h18' },
            { key: "res", label: "Resources",d:'M4 6h16M4 12h16M4 18h16' },
            { key: "chat", label: "Chat" ,d:'M3 3h18v18H3z'},
            { key: "sett", label: "Settings", d:'M12 20v-6' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() =>
                trigger(() => {
                  setActiveMenu(item.key);

                  if (item.key === "chat") {
                    setOpenAvila(true);
                  }
                })
              }
              className={`flex items-center gap-2 font-semibold cursor-pointer ${
                activeMenu === item.key ? "text-white" : "text-gray-400"
              }`}
            >
               
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {item.key === 'chat'? (
                  <circle cx="12" cy="12" r="10" />

                ):(
                  <path d={item.d} />
                )}
              </svg>{" "}

            
              <span>{item.label}</span>
            </button>

          ))}
        </nav>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 overflow-auto">
        {/* Left Panel */}
        <section className={`flex-1 flex flex-col gap-6 ${activeMenu === 'dash' &&  "max-w-full md:max-w-2xl"}`}>
          {activeMenu === "dash" && (
            <>
              <div className="bg-[#142938] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold mb-5">Welcome back {user?.name}!</h1>
                  <div className="text-gray-300">
                    <h1 className="text-2xl text-blue-200">{course?.title ? `${course.title.substring(0, 20)}...` : ""}</h1>
                    <br /><br/>
                    {course?.description}
                  </div>
                </div>
                <img src={course?.image_url} alt={`${course?.title} logo`} className="w-20 h-20 rounded-full object-cover" />
              </div>

              <div className="bg-[#142938] rounded-xl p-4 border border-slate-600 shadow-md my-4">
                <p className="text-gray-400 text-xs">{totalProgress}% completed</p>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${totalProgress}%` }} />
                </div>
              </div>

              <div className="bg-[#142938] rounded-xl p-6 border border-blue-600 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{isFirstTime ? "Ready to start?" : "Continue your learning"}</h3>
                  <p className="text-gray-400 text-sm">{isFirstTime ? "Begin your journey and unlock your first lesson." : `You have completed ${totalProgress}% of this course.`}</p>
                </div>
                <button onClick={() => trigger(()=> {setCurrentLesson(allLessons[0]);setActiveTab("video");setLessonModal(true);}) } className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg font-medium">{isFirstTime ? "Start Course" : "Continue"}</button>
              </div>
            </>
          )}

          {activeMenu === "cont" && (
            <div className="flex flex-col gap-10 px-4 md:px-0">
              
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold text-white tracking-tight">
                  Course Content
                </h2>

                <div className="text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  {chapters.length} Chapters
                </div>
              </div>

              <div className="flex flex-col gap-8">

                {chapters.map((chapter) => (
                  <div
                    key={chapter.chapter_id}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#1f2937]/70 to-[#111827]/80 backdrop-blur-xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2"
                  >

                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 hover:opacity-100 transition"></div>

                    <h3 className="text-2xl font-bold text-white mb-6">
                      {chapter.chapter_title}
                    </h3>

                    <div className="flex flex-col gap-4">

                      {chapter.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={handleLessonClick}

                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                        >

                          <img
                            src={`https://picsum.photos/seed/${lesson.id}/80`}
                            alt="lesson"
                            className="w-14 h-14 rounded-xl object-cover shadow-lg"
                          />

                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {lesson.title}
                            </p>

                            <p
                              className={`text-sm mt-1 font-medium ${
                                lesson.completed
                                  ? "text-green-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {lesson.completed ? "✔ Completed" : "▶ Start lesson"}
                            </p>
                          </div>

                          {lesson.completed && (
                            <div className="text-green-400 text-lg">✔</div>
                          )}

                        </div>
                      ))}

                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}



          {activeMenu === "res" && (
            <div className="flex flex-col gap-10 px-4 md:px-0">

              <h2 className="text-4xl font-bold text-white tracking-tight">
                Resources
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">

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
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#1f2937]/70 to-[#111827]/80 backdrop-blur-xl p-6 flex flex-col items-center justify-center shadow-xl hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-500"
                  >

                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition"></div>

                    <img
                      src={res.logo}
                      alt={res.name}
                      className="w-25 rounded-2xl h-25 object-cover mb-4 transition-transform duration-300 group-hover:scale-110"
                    />

                    <p className="text-white font-semibold text-lg">
                      {res.name}
                    </p>

                    <span className="mt-2 text-blue-400 font-semibold group-hover:text-blue-300">
                      Download →
                    </span>

                  </a>

                ))}

                

              </div>
            </div>
          )}



          {activeMenu === "sett" && (
            <div className="flex flex-col gap-8 px-4 md:px-0 max-w-3xl mx-auto py-10">

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide">
                Settings
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {settingsData.map((setting, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-gray-900 border border-white/10 hover:bg-gray-800 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start sm:items-center gap-4 w-full">
                      <div>{setting.icon}</div>
                      <div className="flex flex-col">
                        <p className="text-gray-400 text-sm md:text-base">{setting.label}</p>
                        <p className="text-white font-semibold text-base md:text-lg truncate">{setting.value}</p>
                      </div>
                    </div>

                    <button className="mt-4 sm:mt-0 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-md transition-all duration-300">
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-10 text-gray-400 text-sm md:text-base text-center">
                Manage your account settings and preferences here. Changes are saved automatically.
              </p>
            </div>
          )}


          {activeMenu === "chat" && (
          <div className="bg-[#142938] lg:mx-0 mx-auto rounded-xl w-full shadow-md">
            <ChatCourseAi topic={course?.title} onClick={()=>setActiveMenu('dash')} />
          </div>
          )}

        
        </section>

        

        {/* Right Panel */}
        {activeMenu === "dash" && (
        <aside className="w-full md:w-64 flex flex-col gap-8 max-w-full">
            <div className="bg-[#142938] rounded-xl p-6 border border-blue-600 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">My schedule</h3>
              </div>
              <div className="flex gap-1 mb-4 text-sm flex-wrap">
                {Object.keys(mySchedule).map((day) => (
                  <button key={day} className={`px-2 py-1 rounded-md ${day === selectedDay ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"}`} onClick={() => setSelectedDay(day)}>{day}</button>
                ))}
              </div>
              <div className="flex flex-col gap-4 min-h-25">
                {(mySchedule[selectedDay] || []).length > 0 ? (
                  mySchedule[selectedDay].map(({ time, class: className }, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-xs text-gray-400">{time}</span>
                      <div className="bg-blue-700 text-white rounded-lg p-2 text-sm">{className}</div>
                    </div>
                  ))
                ) : <p className="text-gray-400 text-sm">No classes scheduled.</p>}
              </div>
            </div>
        </aside>
        )}

        {/* Lesson Modal */}
        <AnimatePresence>
          {lessonModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-4xl bg-[#0f1f35] rounded-3xl shadow-2xl overflow-hidden border border-gray-700"
              >
                {/* Close button */}
                <button
                  onClick={closeVideo}
                  className="absolute top-5 right-5 z-50 text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-800/80 transition-transform hover:scale-110"
                >
                  <X size={28} />
                </button>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 bg-[#10203d]">
                  {["video", "notes"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-center font-semibold transition-all ${
                        activeTab === tab
                          ? tab === "video"
                            ? "border-b-4 border-blue-500 text-white"
                            : "border-b-4 border-green-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab === "video" ? "🎥 Video" : "📝 Notes"}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-1 flex flex-col gap-6">
                  {activeTab === "video" && (
                    currentLesson?.video_url ? (
                     <VideoPlayer
                        key={currentLesson.id} // <-- clé unique pour forcer le rechargement
                        url={currentLesson.video_url}
                        nextLesson={nextLesson}
                        prevLesson={prevLesson}
                      />
                      ) : (
                      <div className="flex items-center justify-center h-60 text-gray-400">
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
                        className="w-full h-56 bg-[#142938]/90 backdrop-blur-sm rounded-2xl p-4 text-white outline-none resize-none shadow-inner focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                      <div className="flex justify-end items-center gap-4">
                        <button className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-2xl font-medium transition-transform hover:scale-105 shadow-md">
                          Save Note
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-2xl font-medium transition-transform hover:scale-105 shadow-md" onClick={() => setActiveMenu("chat")}>
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







{/* VideoPlayer */}
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
      className="relative rounded-2xl overflow-hidden bg-black w-full aspect-video shadow-2xl border border-gray-700"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video */}
      <iframe
        src={iframeUrl}
        title="Lesson Video"
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
      />

      {/* Prev / Next */}
      <div className={`absolute inset-0 flex justify-between items-center px-4 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={prevLesson}
          className="bg-gray-700/70 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-transform hover:scale-110 shadow-lg"
        >
          ←
        </button>
        <button
          onClick={nextLesson}
          className="bg-blue-600/90 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-transform hover:scale-110 shadow-lg"
        >
          →
        </button>
      </div>

      {/* Fullscreen */}
      <button
        onClick={handleFullScreen}
        className={`absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        ⬜
      </button>
    </div>
  );
}