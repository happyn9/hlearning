// src/ai/aiKnowledge.js

const aiKnowledge = [
  // ===== GREETINGS =====
  {
    keywords: ["hello", "hi", "hey"],
    answer: "Hello 👋 How can I help you today?",
  },
  {
    keywords: ["good morning"],
    answer: "Good morning ☀️ How can I assist you?",
  },
  {
    keywords: ["good afternoon"],
    answer: "Good afternoon 😊 What can I help you with?",
  },
  {
    keywords: ["good evening"],
    answer: "Good evening 🌙 How may I help you?",
  },

  // ===== INTRODUCTION =====
  {
    keywords: ["who are you", "what are you"],
    answer:
      "I am Habakkuk AI assistant designed to help you find information, learn new skills, and get guidance on this platform.",
  },
  {
    keywords: ["what can you do", "your role"],
    answer:
      "I can answer questions, explain concepts, guide you through learning paths, and help you understand our services.",
  },

  // ===== PLATFORM =====
  {
    keywords: ["platform", "website", "application"],
    answer:
      "This platform is a modern learning environment designed to help students and professionals grow their skills efficiently.",
  },

  // ===== LEARNING & COURSES =====
  {
    keywords: ["course", "courses"],
    answer:
      "We offer structured courses covering beginner to advanced levels, with practical examples and clear explanations.",
  },
  {
    keywords: ["training", "learn", "learning"],
    answer:
      "Learning here is progressive and guided, allowing you to build strong foundations step by step.",
  },
  {
    keywords: ["programming", "coding", "development"],
    answer:
      "Programming helps you build applications, websites, and digital solutions used across many industries.",
  },
  {
    keywords: ["web development"],
    answer:
      "Web development focuses on building websites and web applications using modern technologies.",
  },
  {
    keywords: ["mobile app"],
    answer:
      "Mobile development allows you to create applications for Android and iOS devices.",
  },

  // ===== PRICING =====
  {
    keywords: ["price", "cost", "pricing", "fee"],
    answer:
      "Some courses are free, while others are premium depending on content depth, mentorship, and certification.",
  },
  {
    keywords: ["free"],
    answer:
      "Yes, we provide free content so you can start learning without any payment.",
  },

  // ===== CERTIFICATION =====
  {
    keywords: ["certificate", "certification"],
    answer:
      "Some programs include certificates to help validate your skills professionally.",
  },

  // ===== CAREER =====
  {
    keywords: ["job", "career", "employment"],
    answer:
      "Learning these skills can help you access job opportunities in technology and engineering fields.",
  },
  {
    keywords: ["internship"],
    answer:
      "Internships help you gain real-world experience while applying what you learn.",
  },

  // ===== SUPPORT =====
  {
    keywords: ["help", "support", "assist"],
    answer:
      "I’m here to help 🙂 Just ask your question or describe what you need.",
  },
  {
    keywords: ["contact"],
    answer:
      "You can contact our support team through the platform for additional assistance.",
  },

  // ===== ACCOUNT =====
  {
    keywords: ["account", "profile"],
    answer:
      "Your account allows you to track progress, save courses, and personalize your learning experience.",
  },
  {
    keywords: ["login", "sign in"],
    answer:
      "You can sign in using your registered email to access your dashboard.",
  },

  // ===== SECURITY =====
  {
    keywords: ["security", "safe"],
    answer:
      "We prioritize data security and privacy to keep your information protected.",
  },

  // ===== TECHNOLOGY =====
  {
    keywords: ["technology", "tech"],
    answer:
      "Technology continues to evolve rapidly, making digital skills more important than ever.",
  },
  {
    keywords: ["ai", "artificial intelligence"],
    answer:
      "Artificial Intelligence helps automate tasks, analyze data, and improve user experiences.",
  },

  // ===== GENERAL QUESTIONS =====
  {
    keywords: ["why learn"],
    answer:
      "Learning new skills helps you stay competitive, adaptable, and confident in your career.",
  },
  {
    keywords: ["how long"],
    answer:
      "Learning duration depends on your pace, consistency, and the complexity of the topic.",
  },

  // ===== THANKS & POLITENESS =====
  {
    keywords: ["thank", "thanks"],
    answer:
      "You’re welcome 😊 Feel free to ask more questions.",
  },
  {
    keywords: ["bye", "goodbye"],
    answer:
      "Goodbye 👋 Wishing you success in your learning journey!",
  },
];

export default aiKnowledge;
