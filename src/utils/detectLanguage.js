export function detectLanguage(countryCode) {
  const frenchCountries = ["CD", "FR", "BE", "CA", "CH", "LU"];

  if (frenchCountries.includes(countryCode)) return "fr";

  return "en"; // default anglophone
}