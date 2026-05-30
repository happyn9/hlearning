import api from "./api";

export async function askAI(message) {
  try {
    const res = await api.post("/ai/chat", {
      message: message,
    });

    return res.reply;
  } catch (err) {
    console.error("AI error:", err);
    return "⚠️ Sorry, the AI is currently unavailable.";
  }
}
