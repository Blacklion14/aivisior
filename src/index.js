// import { chatLoop } from "./chatbot/friendBot.js";

// (async () => {
//   console.log("💖 Your AI Friend is ready. Start chatting!");
//   await chatLoop();
// })();

import express from "express";
import cors from "cors";
import { askWithBooks } from "./services/ragService.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// API endpoint for frontend
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  try {
    const answer = await askWithBooks(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 Frontend server running on port ${PORT}`)
);
