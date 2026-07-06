import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getUserCountry } from "../utils/getUserCountry";
import useTriggerWithProgress from "../hooks/triggerWithProgress";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaAppStore,
  FaGooglePlay,
} from "react-icons/fa";

import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

/* ================= FAQ DATA ================= */
const faqs = [
  { questionKey: "faq.q1.question", answerKey: "faq.q1.answer" },
  { questionKey: "faq.q2.question", answerKey: "faq.q2.answer" },
  { questionKey: "faq.q3.question", answerKey: "faq.q3.answer" },
  { questionKey: "faq.q4.question", answerKey: "faq.q4.answer" },
];

/* ================= LIENS EXTERNES =================
   ⚠️ Remplace ces placeholders par tes vrais liens. */
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/your_username",
  facebook: "https://www.facebook.com/profile.php?id=61591099634553",
  youtube: "https://www.youtube.com/@your_channel",
  twitter: "https://x.com/your_username",
};

const STORE_LINKS = {
  appStore: "https://apps.apple.com/app/idXXXXXXXXX",
  googlePlay: "https://play.google.com/store/apps/details?id=com.your.app",
};

export default function Footer({ showfaq = true }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  // Un seul appel — t ET i18n depuis le même hook
  const { t, i18n } = useTranslation();

  const { loadingAction, progress, trigger } = useTriggerWithProgress();
  const [country, setCountry] = useState("");

  useEffect(() => {
    async function loadCountry() {
      const c = await getUserCountry();
      setCountry(c);
    }
    loadCountry();
  }, []);

  // On utilise i18n.changeLanguage depuis le hook, pas l'import bare
  const handleChangeLanguage = (lang) => {
    trigger(async (setProgress) => {
      setProgress(10);
      await new Promise((r) => setTimeout(r, 150));
      setProgress(40);
      await i18n.changeLanguage(lang); // hook instance, React re-render garanti
      setProgress(80);
      await new Promise((r) => setTimeout(r, 150));
      setProgress(100);
    });
  };

  return (
    <div className="bg-[#F9FAFB]">
      {loadingAction && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-neutral-600 z-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      )}

      {/* ================= FAQ SECTION ================= */}
      {showfaq && (
        <section className="pb-20 pt-2 max-w-5xl mx-auto px-6">
          <h1 className="text-center pt-3 pb-8 text-slate-800 font-bold text-3xl">
            {t("footer.faqTitle")}
          </h1>
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-8 py-6 text-left"
                  >
                    <span
                      className={`text-lg font-semibold transition ${
                        isOpen ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {t(faq.questionKey)}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-gray-400"
                    >
                      <ChevronDown />
                    </motion.div>
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
                        <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                          {t(faq.answerKey)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-neutral-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-5 gap-14">

            {/* BRAND */}
            <div className="md:col-span-2">
              <h3 className="text-white text-2xl font-bold mb-6">h-learning</h3>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Empowering learners worldwide with structured, industry-aligned
                academic programs and certifications.
              </p>
              <div className="mt-8 flex">
                <input
                  type="email"
                  placeholder={t("footer.newsletter")}
                  className="w-full px-4 py-3 rounded-l-xl bg-neutral-900 border border-neutral-800 text-sm focus:outline-none focus:border-amber-500"
                />
                <button className="px-6 bg-amber-500 text-white rounded-r-xl hover:bg-amber-600 transition">
                  {t("footer.subscribe")}
                </button>
              </div>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white font-semibold mb-6">{t("footer.company")}</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition cursor-pointer">{t("footer.careers")}</li>
                <li className="hover:text-white transition cursor-pointer">{t("footer.press")}</li>
                <li className="hover:text-white transition cursor-pointer">{t("footer.helpCenter")}</li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 className="text-white font-semibold mb-6">{t("footer.legal")}</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition cursor-pointer">{t("footer.privacy")}</li>
                <li className="hover:text-white transition cursor-pointer">{t("footer.terms")}</li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h4 className="text-white font-semibold mb-6">{t("footer.connect")}</h4>
              <div className="flex items-center gap-4">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram className="hover:text-amber-500 transition cursor-pointer" />
                </a>

                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="hover:text-amber-500 transition cursor-pointer" />
                </a>

                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube className="hover:text-amber-500 transition cursor-pointer" />
                </a>

                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                >
                  <FaTwitter className="hover:text-amber-500 transition cursor-pointer" />
                </a>
              </div>

              <div className="flex gap-4 mt-6 text-3xl">
                <a
                  href={STORE_LINKS.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="App Store"
                >
                  <FaAppStore className="hover:text-amber-500 transition cursor-pointer" />
                </a>
                <a
                  href={STORE_LINKS.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Google Play"
                >
                  <FaGooglePlay className="hover:text-amber-500 transition cursor-pointer" />
                </a>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-neutral-800 my-16" />

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <span>
              © {new Date().getFullYear()} h-learning Inc. {t("footer.copyright")}
            </span>

            <span className="text-gray-600">{t("footer.built")}</span>

            {/* LANGUAGE SELECT */}
            <div className="relative">
              <select
                onChange={(e) => handleChangeLanguage(e.target.value)}
                value={i18n.language}
                className="appearance-none bg-neutral-900 border border-neutral-700 text-white px-4 py-2 pr-10 rounded-xl cursor-pointer outline-none hover:border-neutral-500 transition"
              >
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <ChevronDown size={16} />
              </div>
            </div>

            <span className="text-gray-600">
              🌍 {country ? `Detected country: ${country}` : "Detecting country..."}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}