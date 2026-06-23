import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import fr from "./fr.json";

const savedLang =
  localStorage.getItem("lang") ||
  navigator.language.split("-")[0] ||
  "en";

// ✅ On capture la Promise retournée par init()
const i18nReady = i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },

  lng: savedLang,
  fallbackLng: "en",

  // ✅ Évite le flash de clés brutes pendant l'init
  react: {
    useSuspense: false,
  },

  interpolation: {
    escapeValue: false,
  },
});

/* ================= SYNC STORAGE AUTOMATIQUE ================= */
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

/* ================= SAFE FUNCTION ================= */
export const changeLanguage = async (lang) => {
  await i18n.changeLanguage(lang);
};

// ✅ Exporté pour que main.jsx puisse attendre l'init avant de render
export { i18nReady };

export default i18n;