import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPremiumCourses } from "../services/premiumAPI";
import { subscribeToCourse } from "../services/subscribeAPI";
import api from "../services/api";
import useTriggerWithProgress from "../hooks/triggerWithProgress";

import logoPy from '../assets/python.png';
import logoJs from '../assets/js.png';
import logoJv from '../assets/java.png';
import logoHtml from '../assets/html.png';
import logoReact from '../assets/react.png';

import {
  BookOpen,
  Layers,
  PlayCircle,
  CheckCircle2,
  Info,
  Users,
  BarChart3,
} from "lucide-react";

export default function CourseInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [premium, setPremium] = useState([]);
  const [operator,setOperator] = useState('zam');
  const [operators,setOperators] = useState([
    {id:1,logo:'htnnnnn'}
  ]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats,SetStats] =useState(null);
  const [scrolled,setScrolled]=useState(0)
  const [code,setCode] = useState('097');
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const { loadingAction, progress, trigger } = useTriggerWithProgress();


  const images = [logoPy, logoReact, logoHtml, logoJv, logoJs];

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, training,statRes] = await Promise.all([
          api(`/courses/${id}`),
          getPremiumCourses(),
          api(`/courses/${id}/stats`)
        ]);
        console.log(courseRes,statRes)
        setCourse(courseRes);
        setPremium(training);
        SetStats(statRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOperator =(opt)=>{
    setOperator(opt);

    switch (opt){
      case 'zam':
        setCode('097');
        break;
      case 'mtn':
        setCode('076');
        break
      case 'airtel':
        setCode('077');
        break
    }

  }
  const handleSubscribe = async () => {
    if (!phone || phone.length < 10)
      return alert("Enter a valid phone number.");

    setProcessing(true);

    try {
      const res = await subscribeToCourse({
        courseId: course.id,   // ✅ BON NOM
        billing: "monthly"
      });

      alert(`Successfully subscribed: ${res.join(", ")}`);
      setShowPaymentModal(false);
      console.log(course.id);

    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setProcessing(false);
    }
  };
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f1115] text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#111315] text-slate-200">
      {loadingAction && (
      <motion.div
        className="fixed top-0 left-0 h-1 bg-neutral-600 z-99"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.02 }}
      />
      )}
      {/* ================= HERO / BANNER ================= */}
      <div className="relative h-70 md:h-80 w-full overflow-hidden">
        <img
          src={images[Number(id)] || logoPy}
          alt={course?.title}
          className="w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40" />

        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1a1c1f]/90 backdrop-blur-xl border border-slate-700 shadow-2xl flex items-center justify-center">
            <img
              src={images[Number(id)] || logoPy}
              alt="logo"
              className="w-16 md:w-20"
            />
          </div>
        </div>
      </div>

      {/* ================= HEADER SECTION ================= */}
      <div className="max-w-6xl mx-auto px-6 -mt-14 relative z-20">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* LEFT SIDE */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {course?.title}
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl">
              {course?.description}
            </p>

            {stats && (
              <div className="flex flex-wrap gap-8 mt-6 text-sm text-slate-400">

                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <span>{stats.total_lessons} Lessons</span>
                </div>

                <div className="flex items-center gap-2">
                  <Layers size={18} />
                  <span>{stats.total_chapters} Chapters</span>
                </div>

                <div className="flex items-center gap-2">
                  <PlayCircle size={18} />
                  <span>{stats.total_video_hours?.toFixed(1)} Hours</span>
                </div>

              </div>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex gap-4 relative h-12">
            <AnimatePresence mode="wait">
              {loadingAction ? (
                // ================= LOADING BUTTON =================
                <motion.button
                  key="loading"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg font-semibold shadow-lg text-white overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    className="h-4 w-4 rounded-full bg-white animate-bounce"
                    layout
                  />
                  Loading...
                </motion.button>
              ) : (
                // ================= START COURSE BUTTON =================
                <motion.button
                  key="start"
                  onClick={() => trigger(() => navigate(`/course/${course.id}`))}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg font-semibold transition shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlayCircle size={18} />
                  Start Course
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!loadingAction && (
                // ================= SUBSCRIBE BUTTON =================
                <motion.button
                  key="subscribe"
                  onClick={() => trigger(() => setShowPaymentModal(true))}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-2.5 rounded-lg transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users size={18} />
                  Subscribe
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ================= LEFT CONTENT ================= */}
        <div className="lg:col-span-2 space-y-10">

          {/* REQUIREMENTS */}
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Info size={20} />
              <h3 className="text-xl font-semibold text-white">
                Requirements
              </h3>
            </div>

            <ul className="space-y-4 text-slate-400">
              {course?.course_requirements?.map((rqm, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-indigo-500 mt-1 shrink-0"
                  />
                  {rqm}
                </li>
              ))}
            </ul>
          </div>

          {/* LEARNING OUTCOMES */}
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={20} />
              <h3 className="text-xl font-semibold text-white">
                What You Will Learn
              </h3>
            </div>

            <ul className="grid md:grid-cols-2 gap-6 text-slate-400">
              {course?.what_you_will_learn?.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-green-500 mt-1 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="space-y-8">

          {/* COURSE INFO CARD */}
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} />
              <h4 className="font-semibold text-white">
                Course Overview
              </h4>
            </div>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex justify-between">
                <span>Lessons</span>
                <span>{stats?.total_lessons}</span>
              </div>

              <div className="flex justify-between">
                <span>Chapters</span>
                <span>{stats?.total_chapters}</span>
              </div>

              <div className="flex justify-between">
                <span>Duration</span>
                <span>{stats?.total_video_hours?.toFixed(1)}h</span>
              </div>
            </div>
          </div>

          {/* COMMUNITY CARD */}
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} />
              <h4 className="font-semibold text-white">
                Community
              </h4>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Connect with other learners, ask questions and share
              your progress inside the course community.
            </p>
          </div>

        </div>

      </div>
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl bg-[#1a1c1f] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >

              {/* HEADER */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-slate-800">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-white">
                    Complete Your Subscription
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    Secure mobile payment via DPO
                  </p>
                </div>

                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-500 hover:text-white transition text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2">

                {/* LEFT SIDE — SUMMARY */}
                <div className="p-8 border-r border-slate-800 bg-[#15171b] flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                      <BookOpen size={20} /> Order Summary
                    </h3>

                    <div className="space-y-5 text-sm text-slate-400">
                      <div className="flex justify-between items-center">
                        <span>Course</span>
                        <span className="text-white flex items-center gap-2">
                          <Layers size={16} className="text-indigo-400" />
                          {course?.title}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Plan</span>
                        <span className="text-indigo-400 font-medium flex items-center gap-1">
                          <BarChart3 size={16} /> Monthly Access
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Duration</span>
                        <span>30 days</span>
                      </div>

                      <div className="border-t border-slate-700 pt-4 flex justify-between text-base">
                        <span>Total</span>
                        <span className="text-2xl font-bold text-white">
                          ZMW {course?.monthly_price || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-xs text-slate-500 text-center">
                    🔒 Payments are encrypted and processed securely via DPO
                  </div>
                </div>

                {/* RIGHT SIDE — PAYMENT */}
                <div className="">
                  <MobileMoneyPaymentForm
                    operator={operator}
                    setOperator={setOperator}
                    phone={phone}
                    setPhone={setPhone}
                    code={code}
                    setCode={setCode}
                    handleSubscribe={handleSubscribe}
                    processing={processing}
                  />
                </div>

                  
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>  
  </div>
  );
}


import { Smartphone } from "lucide-react";

function MobileMoneyPaymentForm({
  operator,
  setOperator,
  phone,
  setPhone,
  code,
  setCode,
  handleSubscribe,
  processing
}) {

  const operators = [
    {
      id: "airtel",
      name: "Airtel",
      code: "0 7 7",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Airtel_Logo.svg"
    },
    {
      id: "mtn",
      name: "MTN",
      code: "0 7 6",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg"
    },
    {
      id: "zam",
      name: "Zamtel",
      code: "0 9 7",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Zamtel_logo.svg"
    }
  ];

  const selectOperator = (op) => {
    setOperator(op.id);
    setCode(op.code);
  };

  return (
    <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md">

      <h3 className="text-sm font-semibold text-gray-600 mb-4">
        MOBILE MONEY PAYMENT
      </h3>

      <div className="space-y-6">

        {/* OPERATORS */}
        <div className="grid grid-cols-3 gap-3">

          {operators.map((op) => (
            <button
              key={op.id}
              onClick={() => selectOperator(op)}
              className={`border rounded-lg p-3 flex flex-col items-center transition
              ${
                operator === op.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img
                src={op.logo}
                alt={op.name}
                className="h-6 object-contain mb-1"
              />

              <span className="text-xs">{op.name}</span>
            </button>
          ))}

        </div>

        {/* PHONE NUMBER */}
        <div>
          <label className="text-sm text-gray-500">
            Mobile Number
          </label>

          <div className="flex mt-1">

            <span className="px-4 flex items-center bg-gray-100 border-gray-200 border border-r-0 rounded-l-lg text-sm">
              {code}
            </span>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="XXXXXXX"
              className="flex-1 border-gray-200 border rounded-r-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* INFO */}
        <p className="text-xs text-gray-500">
          A payment request will be sent to your phone.  
          Confirm the payment on your mobile device.
        </p>

        {/* BUTTON */}
        <button
          disabled={phone.length < 7 || processing}
          onClick={handleSubscribe}
          className={`w-full ${operator === 'airtel' && " bg-red-400 hover:bg-red-500"} ${operator === 'mtn' && " bg-yellow-400 hover:bg-yellow-500"} ${operator === 'zam' && " bg-green-300 hover:bg-green-400"} duration-100 cursor-pointer py-3 rounded-full font-semibold transition disabled:opacity-50`}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>

      </div>
    </div>
  );
}
