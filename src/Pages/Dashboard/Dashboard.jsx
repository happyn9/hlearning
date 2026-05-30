import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";
import { motion } from "framer-motion";
import api from "../../services/api";
import CourseDash from "../../Components/CourseDash";
import Footer from "../../Components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";


export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState("Wed");
  const { user, setUser, loading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const [summary, setSummary] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate()
  const [mySchedule, setMySchedule] = useState({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });

  // 🔹 Fetch data dès le montage
  useEffect(() => {
  const fetchData = async () => {
      try {
        const [summaryData, scheduleData, coursesData] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/schedule"),
          api.get("/dashboard/my-courses-with-progress")
        ]);

        setSummary(summaryData);
        setMySchedule(scheduleData);
        setMyCourses(coursesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
      }
    };

    fetchData();
  }, []);

  // Menu handler avec trigger
  const handleMenu = (menu) => {
    trigger(() => {
      setActiveMenu(menu);
      setSidebarOpen(false);
    });
  };

  if (loading || !summary) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="">
      <div className="min-h-screen bg-[#0c1824] text-white font-sans flex flex-col md:flex-row">
        {/* Progress bar */}
        {loadingAction && (
          <motion.div
            className="fixed top-0 left-0 h-1 bg-neutral-600 z-50"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.02 }}
          />
        )}

        <header className="md:hidden flex items-center justify-between p-4 bg-[#0f1f35]">
          <h2 className="text-blue-500 font-bold text-lg">Learning</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Sidebar */}
        <aside
          className={`bg-[#0f1f35] p-6 flex flex-col gap-8 select-none
          fixed top-0 left-0 h-full w-60 z-50 transform transition-transform duration-300
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <h2 className="text-blue-500 font-bold text-lg hidden md:block">Learning</h2>
          <span onClick={()=>navigate(`/`)} className="absolute right-4 cursor-pointer hover:text-gray-400 border p-3 rounded-full top-5"><ArrowLeft /></span>
          <nav className="flex flex-col gap-4 text-gray-400">
            <button className="text-white font-semibold flex items-center gap-2 cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h18v18H3z" />
              </svg>{" "}
              Dashboard
            </button>
            <button className="flex items-center gap-2 opacity-50 cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 20v-6" />
              </svg>{" "}
              Courses
            </button>
            <button className="flex items-center gap-2 opacity-50 cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>{" "}
              Resources
            </button>
            <button className="flex items-center gap-2 opacity-50 cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 10h18M3 14h18" />
              </svg>{" "}
              Schedule
            </button>
            <button className="flex items-center gap-2 opacity-50 cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>{" "}
              Chat
            </button>
            <button className="flex items-center gap-2 opacity-50 cursor-not-allowed">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 20v-6" />
              </svg>{" "}
              Settings
            </button>
          </nav>
        </aside>


        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 overflow-auto">
          {/* Centre Dashboard */}
          <section className="flex-1 flex flex-col gap-6 max-w-full md:max-w-2xl">
            {activeMenu === "dashboard" && (
              <>
                {/* Welcome */}
                <div className="bg-[#142938] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-5">
                      Welcome back {user?.name || "Learner"}!
                    </h1>
                    <p className="text-gray-300">
                      You've learned <strong>{summary.progress_percent}%</strong> of your goal.
                      <br />
                      Keep learning and improve overall results.
                    </p>
                  </div>
                  <img
                    src={user?.photo_url}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>

                {/* Results dynamically */}
                <div className="bg-[#142938] rounded-xl p-6 border border-blue-600 shadow-md max-w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Results</h2>
                    <button className="text-blue-500 text-sm hover:underline">
                      Full results →
                    </button>
                  </div>
                  {myCourses.map(course => {
                    const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
                    const completedLessons = course.chapters.reduce(
                      (acc, ch) => acc + ch.lessons.filter(l => l.completed).length,
                      0
                    );
                    const courseProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

                    return (
                      <div key={course.id} className="mb-6">
                        <div className="flex justify-between text-gray-300 mb-1 cursor-pointer"
                            onClick={() => navigate(`/course/info/${course.id}`)}>
                          <span className="text-blue-400 hover:underline">{course.title}</span>
                          <span>{courseProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <motion.div
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${courseProgress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </>
            )}
          </section>

          {/* Right Panel */}
          {activeMenu === "dashboard" && (
            <aside className="w-full md:w-64 flex flex-col gap-8 max-w-full">
              {/* Schedule */}
              <div className="bg-[#142938] rounded-xl p-6 border border-blue-600 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">My schedule</h3>
                  <span className="text-sm text-blue-500 cursor-default">Today</span>
                </div>
                <div className="flex gap-1 mb-4 text-sm flex-wrap">
                  {Object.keys(mySchedule).map((day) => (
                    <button
                      key={day}
                      className={`px-2 py-1 rounded-md ${
                        day === selectedDay
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:bg-white/10"
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-4 min-h-25">
                  {(mySchedule[selectedDay] || []).length > 0 ? (
                    mySchedule[selectedDay].map(({ time, class: className }, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-xs text-gray-400">{time}</span>
                        <div className="bg-blue-700 text-white rounded-lg p-2 text-sm">
                          {className}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No classes scheduled.</p>
                  )}
                </div>
                <button className="mt-4 w-full bg-blue-600 rounded-lg py-2 hover:bg-blue-500 transition">
                  Change Schedule
                </button>
              </div>

              {/* Profile */}
              <div className="bg-[#142938] rounded-xl p-6 border border-blue-600 shadow-md flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img
                    src={"https://i.pravatar.cc/150?img=12"}
                    alt="profile avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="font-semibold text-xl">{user?.name || "Learner"}</h2>
                <p className="text-gray-400 text-sm">{user?.onboarding?.program}</p>
              </div>
            </aside>
          )}
        </main>
        
      </div>
      {/* My Courses buttons */}
      {activeMenu === 'dashboard' &&
      <CourseDash />
      }
      <Footer showfaq={false} />
    </div>
  );
}


