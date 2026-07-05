import i18n from "i18next";
import { getUserCountry } from "./getUserCountry";
import { detectLanguage } from "./detectLanguage";

export default async function initLanguage() {
  const savedLang = localStorage.getItem("lang");

  if (savedLang) {
    i18n.changeLanguage(savedLang);
    return;
  }

  let lang = "en";
  try {
    const country = await getUserCountry();
    lang = detectLanguage(country);
  } catch (err) {
    console.warn("Language detection failed, defaulting to English:", err);
  }

  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
}