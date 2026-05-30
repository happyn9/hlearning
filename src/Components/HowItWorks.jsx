import { useRef, useState } from "react";
import intro from "../assets/intro.mp4";
import { VideoIcon, PenIcon, WorkflowIcon, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HowItWorks({  }) {
  const videoRef = useRef(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  };

  const closeVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setPlaying(false);
    setProgress(0);
    setOpen(false);
  };

  const handleTimeUpdate = () => setProgress(videoRef.current.currentTime);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  const features = [
    {
      icon: <VideoIcon size={28} className="text-pink-500" />,
      title: t("how.features.video.title"),
      desc: t("how.features.video.desc"),
    },
    {
      icon: <PenIcon size={28} className="text-green-500" />,
      title: t("how.features.written.title"),
      desc: t("how.features.written.desc"),
    },
    {
      icon: <WorkflowIcon size={28} className="text-blue-500" />,
      title: t("how.features.quiz.title"),
      desc: t("how.features.quiz.desc"),
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

        {/* FEATURES */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-4xl font-bold text-gray-900 mb-12 leading-tight">
            {t("how.title")}
          </h3>

          <div className="space-y-8">
            {features.map((feature, idx) => (
              <Feature key={idx} {...feature} />
            ))}
          </div>
        </motion.div>

        {/* VIDEO PREVIEW */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 120 }}
          onClick={() => setOpen(true)}
          className="relative h-96 rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
        >
          <video
            src={intro}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <motion.div
              className="bg-linear-to-tr from-indigo-500 to-pink-500 p-6 rounded-full shadow-2xl group-hover:scale-110 transition-all"
              whileHover={{ scale: 1.2 }}
            >
              <Play size={40} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          >
            <button
              onClick={closeVideo}
              className="absolute top-6 right-6 text-white hover:scale-110 transition"
            >
              <X size={36} />
            </button>

            <div className="w-full max-w-5xl space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={intro}
                  className="w-full rounded-3xl"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(videoRef.current.duration)}
                />

                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition rounded-3xl"
                >
                  {playing ? <PauseIcon /> : <Play size={56} className="text-white" />}
                </button>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-4 text-white text-sm">
                <span>{formatTime(progress)}</span>

                <div
                  onClick={handleSeek}
                  className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer"
                >
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${(progress / duration) * 100}%` }}
                  />
                </div>

                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ================= FEATURE =================
function Feature({ icon, title, desc }) {
  return (
    <motion.div
      title={title}
      className="flex items-start gap-5 p-4 rounded-2xl bg-white/20 backdrop-blur-md shadow hover:shadow-lg transition cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-3 rounded-xl bg-white/10">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-700 text-sm mt-1">{desc}</p>
      </div>
    </motion.div>
  );
}

// ================= ICON =================
function PauseIcon() {
  return (
    <div className="flex gap-2">
      <span className="w-3 h-8 bg-white rounded" />
      <span className="w-3 h-8 bg-white rounded" />
    </div>
  );
}