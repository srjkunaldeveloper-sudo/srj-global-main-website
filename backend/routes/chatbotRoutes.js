const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const db = require("../config/db");
const { validateChatMessage } = require("../middleware/validators");
const { chatbotLimiter } = require("../config/rateLimits");

const hasApiKey = !!process.env.GROQ_API_KEY;
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "placeholder_key_to_prevent_startup_crash",
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/chat", chatbotLimiter, validateChatMessage, async (req, res) => {
  try {
    if (!hasApiKey) {
      return res.status(503).json({
        reply: "AI Chatbot assistant is currently undergoing maintenance. Please try again later.",
      });
    }

    const { message } = req.body;


    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are SRJ Global Technologies AI assistant. Answer clearly and helpfully.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    await db.query(
      "INSERT INTO chats (user_message, bot_reply) VALUES (?, ?)",
      [message, reply],
    );

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot Error:", error.message);

    return res.status(500).json({
      reply: error.message || "AI service error",
    });
  }
});

module.exports = router;
