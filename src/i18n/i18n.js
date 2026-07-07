import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import fr from "./fr.json";

// ⚠️ Adapte ce chemin vers ton client HTTP existant (celui qui ajoute déjà
// le token d'auth dans les headers, ex: axios.create({ baseURL: ... })).
import api from "../services/api";

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
// L'auth se fait via un cookie httponly (access_token), pas via
// localStorage — donc pas de check de token ici, JS ne peut de toute façon
// pas le lire. Le cookie part automatiquement grâce à withCredentials.
// Si l'utilisateur n'est pas connecté, le backend renverra un 401, géré
// silencieusement ci-dessous sans casser le changement de langue côté UI.
export const syncLanguageWithBackend = async (lang) => {
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