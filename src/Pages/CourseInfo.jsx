import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPremiumCourses } from "../services/premiumAPI";
import { initiatePayment, checkSubscription } from "../services/subscribeAPI";
import api from "../services/api";
import useTriggerWithProgress from "../hooks/triggerWithProgress";
import { OPERATORS, PHONE_LOCAL_LENGTH } from "../constants/operators";

import logoPy from "../assets/python.png";
import logoJs from "../assets/js.png";
import logoJv from "../assets/java.png";
import logoHtml from "../assets/html.png";
import logoReact from "../assets/react.png";

import {
  BookOpen, Layers, PlayCircle, CheckCircle2, Info,
  Users, BarChart3, ArrowLeft, ShieldCheck,
} from "lucide-react";

/* ============================================================
   SUBSCRIPTION PAGE (replaces the modal)
   ============================================================ */
function SubscriptionPage({ course, onBack }) {
  const [plan, setPlan]           = useState("standard");
  const [operator, setOperator]   = useState(OPERATORS[0].id);
  const [phone, setPhone]         = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedOperator = OPERATORS.find((op) => op.id === operator);

  const prices = { standard: course?.standard_price || 0, premium: Math.round((course?.premium_price || 0)) };
  const labels = { standard: "Standard plan", premium: "Premium" };

  function getRenewDate(months) {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  }

  const renewDate = plan === "standard" ? getRenewDate(1) : getRenewDate(12);
  const price     = prices[plan];
  const suffix    = plan === "premium" ? "/month" : "/year";

  const handlePhoneChange = (raw) => {
    setPhone(raw.replace(/\D/g, "").slice(0, PHONE_LOCAL_LENGTH));
  };

  const handleSubscribe = async () => {
  if (phone.length !== PHONE_LOCAL_LENGTH)
    return alert(`Enter a valid ${PHONE_LOCAL_LENGTH}-digit phone number.`);

  const billingMap = { standard: "monthly", premium: "yearly" }; // ← ajoute ça

  const fullPhone = selectedOperator.code + phone;
  setProcessing(true);
  try {
    const { payment_url } = await initiatePayment({
      course_id: course.id,
      billing: billingMap[plan],  // ← "monthly" ou "yearly"
      phone: fullPhone,
      operator,
    });
    window.location.href = payment_url;
  } catch (err) {
    alert(err.message || "Payment initiation failed.");
    setProcessing(false);
  }
};

  const buttonColor =
    operator === "airtel" ? "bg-red-400 hover:bg-red-500" :
    operator === "mtn"    ? "bg-yellow-400 hover:bg-yellow-500" :
                            "bg-green-300 hover:bg-green-400";

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#111315] text-slate-200 overflow-y-auto"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
    >
      <div className="max-w-lg mx-auto px-6 py-8">

        {/* BACK */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-semibold text-white mb-6">Pro plan</h1>

        {/* PLAN SELECTOR */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { id: "standard", label: "Standard", sub: `ZMW ${prices?.standard?.toLocaleString()} /month` },
            { id: "premium",  label: "Premium",  sub: `ZMW ${prices?.premium?.toLocaleString()} /month`, badge: "Save 17%" },
          ].map(({ id, label, sub, badge }) => (
            <button
              key={id}
              onClick={() => setPlan(id)}
              className={`relative text-left border rounded-xl p-4 transition
                ${plan === id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-slate-700 bg-[#1a1c1f] hover:border-slate-500"}`}
            >
              {badge && (
                <span className="absolute top-2.5 right-2.5 text-[11px] bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">
                  {badge}
                </span>
              )}
              {/* Radio dot */}
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mb-3
                ${plan === id ? "border-indigo-400 bg-indigo-500" : "border-slate-600"}`}>
                {plan === id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <p className={`font-medium text-sm ${plan === id ? "text-indigo-300" : "text-white"}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${plan === id ? "text-indigo-400" : "text-slate-400"}`}>{sub}</p>
            </button>
          ))}
        </div>

        {/* ORDER DETAILS */}
        <div className="bg-[#1a1c1f] border border-slate-800 rounded-xl p-5 mb-4">
          <p className="text-sm font-medium text-white mb-4">Order details</p>

          <div className="flex justify-between text-sm text-slate-400 py-1">
            <span>
              Pro plan<br />
              <span className="text-xs text-slate-500">{labels[plan]}</span>
            </span>
            <span className="text-white">ZMW {price}</span>
          </div>

          <hr className="border-slate-800 my-3" />

          <div className="flex justify-between text-sm text-slate-400 py-1">
            <span>Subtotal</span>
            <span className="text-white">ZMW {price}</span>
          </div>

          <hr className="border-slate-800 my-3" />

          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-slate-400">Total due today</span>
            <span className="text-2xl font-semibold text-white">ZMW {price}</span>
          </div>
        </div>

        {/* AUTO-RENEW INFO */}
        <div className="flex gap-3 bg-[#1a1c1f] border border-slate-800 rounded-xl p-4 mb-6 text-xs text-slate-400 leading-relaxed">
          <Info size={15} className="shrink-0 mt-0.5" />
          <span>
            Your subscription will auto renew on <strong className="text-slate-300">{renewDate}</strong>.
            You will be charged ZMW {price}.00{suffix} + tax.
          </span>
        </div>

        {/* MOBILE MONEY FORM */}
        <div className="bg-white rounded-xl p-5 text-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={15} className="text-green-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Money Payment</p>
          </div>

          {/* OPERATORS */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {OPERATORS.map((op) => (
              <button
                key={op.id}
                onClick={() => setOperator(op.id)}
                className={`border rounded-lg p-3 flex flex-col items-center transition
                  ${operator === op.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-400"}`}
              >
                <img src={op.logo} alt={op.name} className="h-6 object-contain mb-1" />
                <span className="text-xs">{op.name}</span>
              </button>
            ))}
          </div>

          {/* PHONE */}
          <div className="mb-4">
            <label className="text-sm text-gray-500">Mobile number</label>
            <div className="flex mt-1">
              <span className="px-4 flex items-center bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm">
                {selectedOperator.code}
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="XXXXXXX"
                maxLength={PHONE_LOCAL_LENGTH}
                className="flex-1 border border-gray-200 rounded-r-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{phone.length}/{PHONE_LOCAL_LENGTH} digits</p>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            A payment request will be sent to your phone. Confirm the payment on your mobile device.
          </p>

          <button
            disabled={phone.length !== PHONE_LOCAL_LENGTH || processing}
            onClick={handleSubscribe}
            className={`w-full ${buttonColor} duration-100 cursor-pointer py-3 rounded-full font-semibold transition disabled:opacity-50`}
          >
            {processing ? "Processing..." : `Pay ZMW ${price}`}
          </button>
        </div>

      </div>
    </motion.div>
  );
}

/* ============================================================
   COURSE INFO (main page)
   ============================================================ */
export default function CourseInfo() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [showSubscription, setShowSubscription] = useState(false);
  const [premium, setPremium]   = useState([]);
  const [course, setCourse]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { loadingAction, progress, trigger } = useTriggerWithProgress();

  const images = [logoPy, logoReact, logoHtml, logoJv, logoJs];

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, training, statRes] = await Promise.all([
          api(`/courses/${id}`),
          getPremiumCourses(),
          api(`/courses/${id}/stats`),
        ]);
        setCourse(courseRes);
        const subscribed = await checkSubscription(id);
        setIsSubscribed(subscribed);
        setPremium(training);
        setStats(statRes || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      alert("Payment successful! You now have access to this course.");
      setIsSubscribed(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("already_subscribed")) {
      alert("You are already subscribed to this course.");
      setIsSubscribed(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f1115] text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#111315] text-slate-200">

      {/* PROGRESS BAR */}
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-neutral-600 z-99"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.02 }}
        />
      )}

      {/* SUBSCRIPTION PAGE (full-screen slide-up) */}
      <AnimatePresence>
        {showSubscription && (
          <SubscriptionPage
            course={course}
            onBack={() => setShowSubscription(false)}
          />
        )}
      </AnimatePresence>

      {/* HERO */}
      <div className="relative h-70 md:h-80 w-full overflow-hidden">
        <img
          src={images[Number(id)] || logoPy}
          alt={course?.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1a1c1f]/90 backdrop-blur-xl border border-slate-700 shadow-2xl flex items-center justify-center">
            <img src={images[Number(id)] || logoPy} alt="logo" className="w-16 md:w-20" />
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 -mt-14 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {course?.title}
            </h1>
            <p className="text-slate-400 mt-3 max-w-2xl">{course?.description}</p>
            {stats && (
              <div className="flex flex-wrap gap-8 mt-6 text-sm text-slate-400">
                <div className="flex items-center gap-2"><BookOpen size={18} /><span>{stats.total_lessons} Lessons</span></div>
                <div className="flex items-center gap-2"><Layers size={18} /><span>{stats.total_chapters} Chapters</span></div>
                <div className="flex items-center gap-2"><PlayCircle size={18} /><span>{stats.total_video_hours?.toFixed(1)} Hours</span></div>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 relative h-12">
            <AnimatePresence mode="wait">
              {loadingAction ? (
                <motion.button
                  key="loading"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg font-semibold shadow-lg text-white overflow-hidden"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                >
                  <motion.div className="h-4 w-4 rounded-full bg-white animate-bounce" layout />
                  Loading...
                </motion.button>
              ) : isSubscribed ? (
                <motion.button
                  key="start"
                  onClick={() => trigger(() => navigate(`/course/${course.id}`))}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg font-semibold transition shadow-lg"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <PlayCircle size={18} /> Start Course
                </motion.button>
              ) : null}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!loadingAction && !isSubscribed && (
                <motion.button
                  key="subscribe"
                  onClick={() => trigger(() => setShowSubscription(true))}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-2.5 rounded-lg transition"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <Users size={18} /> Subscribe
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6"><Info size={20} /><h3 className="text-xl font-semibold text-white">Requirements</h3></div>
            <ul className="space-y-4 text-slate-400">
              {course?.course_requirements?.map((rqm, i) => (
                <li key={i} className="flex gap-3"><CheckCircle2 size={18} className="text-indigo-500 mt-1 shrink-0" />{rqm}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6"><BookOpen size={20} /><h3 className="text-xl font-semibold text-white">What You Will Learn</h3></div>
            <ul className="grid md:grid-cols-2 gap-6 text-slate-400">
              {course?.what_you_will_learn?.map((item, i) => (
                <li key={i} className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 mt-1 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4"><BarChart3 size={18} /><h4 className="font-semibold text-white">Course Overview</h4></div>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex justify-between"><span>Lessons</span><span>{stats?.total_lessons}</span></div>
              <div className="flex justify-between"><span>Chapters</span><span>{stats?.total_chapters}</span></div>
              <div className="flex justify-between"><span>Duration</span><span>{stats?.total_video_hours?.toFixed(1)}h</span></div>
            </div>
          </div>
          <div className="bg-[#1a1c1f] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4"><Users size={18} /><h4 className="font-semibold text-white">Community</h4></div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect with other learners, ask questions and share your progress inside the course community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}