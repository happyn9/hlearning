export async function getUserCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_code; // ex: CD, ZM, US
  } catch (error) {
    console.log("Country detection failed", error);
    return "US";
  }
}