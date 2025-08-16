import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files directly from root
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Text endpoint
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a coding assistant. Write clean code based on the user’s prompt." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });
    res.json({ output: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Fallback to index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});