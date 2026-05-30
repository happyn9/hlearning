// simulate AI responses
export const askAIMock = async (message) => {
  const text = message.toLowerCase();
  await new Promise(r => setTimeout(r, 500)); // simulate thinking

  if (text.startsWith("what is") || text.startsWith("what's")) {
    return `Good question. "${message}" refers to an important concept or topic.`;
  }
  if (text.startsWith("how")) {
    return `Usually, it depends on context. Follow clear steps and adapt to your needs.`;
  }
  if (text.startsWith("why")) {
    return `This is explained by multiple factors like context, objectives, or constraints.`;
  }
  if (text.includes("price") || text.includes("cost")) {
    return `Costs vary depending on complexity, duration, and included services.`;
  }
  if (text.includes("learn") || text.includes("course") || text.includes("training")) {
    return `We provide structured learning paths from beginner to advanced.`;
  }
  if (text.includes("help") || text.includes("support")) {
    return `I'm here to help 🙂 Ask anything you want to learn or solve.`;
  }

  // fallback
  return `Interesting! Could you clarify what exactly you want to know?`;
};