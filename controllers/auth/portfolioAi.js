import express from "express";
import fetch from "node-fetch"; // if you’re using OpenAI or any LLM API
import 'dotenv/config';

const router = express.Router();

// POST /api/ai/generate-bio
router.post("/generate-bio", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Example with OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or gpt-4 / gpt-3.5
        messages: [
          { role: "system", content: "You are a helpful assistant that writes professional student portfolio bios." },
          { role: "user", content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "No response generated.";

    res.json({ text });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "Failed to generate bio" });
  }
});

export default router;
