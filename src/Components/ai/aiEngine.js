// src/ai/aiEngine.js
import aiKnowledge from "./aiKnowledge";

export const generateAIResponse = (question) => {
  const q = question.toLowerCase();

  // 1️⃣ Keyword matching
  for (let item of aiKnowledge) {
    if (item.keywords.some((k) => q.includes(k))) {
      return item.answer;
    }
  }

  // 2️⃣ Generic question types
  if (q.startsWith("how")) {
    return "It depends on the context. Generally, following clear steps and using the right tools leads to good results.";
  }

  if (q.startsWith("why")) {
    return "This is usually influenced by several factors such as goals, context, and available resources.";
  }

  if (q.startsWith("what is") || q.startsWith("what are")) {
    return "This refers to an important concept used in different contexts, depending on the situation.";
  }

  // 3️⃣ Fallback (AI always responds)
  return "That’s an interesting question 🙂 Could you please provide more details or clarify what you’d like to know?";
};
