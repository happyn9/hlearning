import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTriggerWithProgress from "../../hooks/triggerWithProgress";
import { useTranslation } from "react-i18next";

const HLearningLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="flameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#534AB7" />
        <stop offset="100%" stopColor="#1D9E75" />
      </linearGradient>
    </defs>

    {/* Flame shape */}
    <path
      d="M20 38
         C20 38 6 30 7 19
         C8 11 14 8 14 8
         C12 14 17 17 18 12
         C19 7 17 2 22 0
         C21 7 26 10 27 16
         C29 10 30 4 28 0
         C34 7 33 16 31 22
         C33 30 20 38 20 38Z"
      fill="url(#flameGrad)"
    />

    {/* Inner white glow core */}
    <ellipse cx="20" cy="24" rx="5" ry="7" fill="white" opacity="0.18" />

    {/* "h" letter */}
    <text
      x="20"
      y="30"
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontSize="16"
      fontWeight="700"
      fill="white"
    >
      h
    </text>
  </svg>
);

export default function Navbar({ OnNav, onModal }) {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const { t } = useTranslation();

  const [menuHamb, setMenuHamb] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const connected = Boolean(user);
  const userInitial = user?.name?.charAt(0)?.toUpperCase();

  const courses = [
    { id: 1, title: "Python" },
    { id: 2, title: "JavaScript" },
    { id: 3, title: "Java" },
    { id: 4, title: "Data Science" },
  ];

  const menuItems = [
    { name: "home", route: "/" },
    { name: "programs", route: "/programs" },
    { name: "courses", route: "/courses" },
    ...(!connected ? [{ name: "signin", route: "/login" }] : []),
  ];

  const filteredCourses = searchQuery
    ? courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const goHome = () => trigger(() => navigate("/"));

  if (loading) return null;

  return (
    <header className="w-full relative bg-white/80 backdrop-blur">

      {/* PROGRESS BAR */}
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-blue-600 z-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      )}

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">

        {/* LOGO */}
        <div
          onClick={goHome}
          className="flex items-center gap-3 cursor-pointer"
        >
          <HLearningLogo />
          <span className="text-xl font-light text-gray-900 tracking-tight">
            hlearning
          </span>
        </div>

        {/* SEARCH */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder={t("navbar.search")}
            className="w-96 px-5 py-2.5 rounded-full bg-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && filteredCourses.length > 0 && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg w-96 z-50">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchQuery("");
                    navigate(`/course/info/${course.id}`);
                  }}
                >
                  {course.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — avatar ou bouton signup */}
        {connected ? (
          <div
            onClick={onModal}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white cursor-pointer overflow-hidden"
          >
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>
        ) : (
          <button
            onClick={OnNav}
            className="hidden lg:flex cursor-pointer items-center gap-2 px-5 py-2 bg-gray-800 text-white rounded-lg"
          >
            {t("navbar.signup")} <ArrowRight size={18} />
          </button>
        )}

        {/* HAMBURGER MOBILE */}
        {!connected && (
          <button
            className="lg:hidden text-3xl text-gray-700"
            onClick={() => setMenuHamb(!menuHamb)}
          >
            <ion-icon name={menuHamb ? "close-outline" : "filter-outline"} />
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuHamb && (
          <motion.div
            className="lg:hidden bg-white shadow-md overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setMenuHamb(false);
                  navigate(item.route);
                  if (item.name === "signin") OnNav?.();
                }}
              >
                {t(`navbar.${item.name}`)}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}