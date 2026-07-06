import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import fr from "./fr.json";

// ⚠️ Adapte ce chemin vers ton client HTTP existant (celui qui ajoute déjà
// le token d'auth dans les headers, ex: axios.create({ baseURL: ... })).
import api from "./api";

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

/* ================= SYNC BACKEND (langue -> emails/push) ================= */
// N'envoie la requête que si l'utilisateur est connecté (sinon 401 inutile).
// L'échec de la synchro ne doit jamais casser le changement de langue côté
// UI : on log juste un warning.
export const syncLanguageWithBackend = async (lang) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await api.patch("/api/users/me/language", { language: lang });
  } catch (err) {
    console.warn("Sync langue backend échouée:", err);
  }
};

/* ================= SYNC STORAGE AUTOMATIQUE ================= */
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  syncLanguageWithBackend(lng);
});

/* ================= SAFE FUNCTION ================= */
export const changeLanguage = async (lang) => {
  await i18n.changeLanguage(lang);
};

// ✅ Exporté pour que main.jsx puisse attendre l'init avant de render
export { i18nReady };

export default i18n;