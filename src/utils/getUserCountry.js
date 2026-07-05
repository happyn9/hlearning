/* ================= GEO DETECTION =================
   Corrige le 429 (quota ipapi.co dépassé) qui s'affichait comme une
   erreur CORS : une réponse 429 n'a pas d'en-tête
   Access-Control-Allow-Origin, donc le navigateur la reporte comme
   un blocage CORS alors que la vraie cause est le rate-limit.

   Stratégie :
   1. Cache localStorage (24h) — évite de retaper l'API à chaque
      reload / remount, la cause principale du 429 en dev.
   2. Dédup des appels concurrents — Footer.jsx ET initLanguage.js
      appellent getUserCountry() quasi en même temps au boot ; sans
      dédup, ça fait deux requêtes réseau pour un seul résultat.
   3. Timeout par requête, pour ne jamais bloquer l'UI si l'API
      traîne ou ne répond pas.
   4. Fournisseur de repli (geojs.io, pas de clé, CORS ouvert,
      quota bien plus large) si ipapi.co échoue.
   5. Repli final sur navigator.language si tout échoue — pas de
      réseau, jamais de CORS, toujours disponible.
================================================== */

const CACHE_KEY = "geo_country";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

let pendingRequest = null; // dédup des appels concurrents

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { country, ts } = JSON.parse(raw);
    if (!country || Date.now() - ts > CACHE_TTL_MS) return null;
    return country;
  } catch {
    return null;
  }
}

function writeCache(country) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ country, ts: Date.now() }));
  } catch {
    // localStorage indisponible (navigation privée stricte, quota plein…) — pas bloquant
  }
}

async function fetchWithTimeout(url, ms = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/* Repli sans réseau : dérive un code pays plausible depuis la
   locale du navigateur (ex: "fr-CA" → "CA", "fr-FR" → "FR"). */
function guessCountryFromLocale() {
  try {
    const locale = navigator.language || navigator.languages?.[0] || "";
    const parts = locale.split("-");
    if (parts.length > 1 && parts[1].length === 2) {
      return parts[1].toUpperCase();
    }
  } catch {
    // ignore
  }
  return "US";
}

async function detectCountry() {
  // 1) ipapi.co
  try {
    const data = await fetchWithTimeout("https://ipapi.co/json/");
    if (data?.country_code) return data.country_code;
  } catch (err) {
    console.warn("ipapi.co unavailable, trying fallback provider:", err.message);
  }

  // 2) geojs.io — sans clé, CORS ouvert, quota bien plus permissif
  try {
    const data = await fetchWithTimeout("https://get.geojs.io/v1/ip/country.json");
    if (data?.country) return data.country;
  } catch (err) {
    console.warn("geojs.io unavailable, falling back to browser locale:", err.message);
  }

  // 3) repli local, toujours disponible
  return guessCountryFromLocale();
}

export async function getUserCountry() {
  const cached = readCache();
  if (cached) return cached;

  // un seul appel réseau en vol à la fois, même si plusieurs
  // composants demandent le pays en même temps au boot de l'app
  if (pendingRequest) return pendingRequest;

  pendingRequest = detectCountry()
    .then((country) => {
      writeCache(country);
      return country;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}