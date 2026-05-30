import i18n from "i18next";
import { getUserCountry } from "./getUserCountry";
import { detectLanguage } from "./detectLanguage";

export default async function initLanguage() {
  const savedLang = localStorage.getItem("lang");

  if (savedLang) {
    i18n.changeLanguage(savedLang);
    return;
  }

  const country = await getUserCountry();
  const lang = detectLanguage(country);

  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
}