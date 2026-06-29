import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Chat
  app.get("/api/debug", (req, res) => {
    res.json({ 
      status: "online", 
      env: process.env.NODE_ENV,
      time: new Date().toISOString()
    });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
      }

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are 'Bridge AI', a helpful educational assistant for Exam Bridge, an Ethiopian entrance exam preparation platform. Your goal is to help students with their studies, explain complex concepts in Biology, Physics, Chemistry, Mathematics, History, Geography, and Economics, and provide guidance for their exams. Keep responses encouraging and professional.",
          },
          ...messages,
        ],
        model: "llama-3.3-70b-versatile",
      });

      res.json({ message: completion.choices[0]?.message?.content || "" });
    } catch (error: any) {
      console.error("Groq AI Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI Assistant" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production (bundled to dist/server.cjs), static files are in the same directory
    const distPath = process.env.NODE_ENV === "production" ? __dirname : path.join(process.cwd(), 'dist');
    
    console.log(`Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    
    // Explicitly handle manifest and sw if needed, though express.static should catch them
    app.get('/manifest.json', (req, res) => {
      res.sendFile(path.join(distPath, 'manifest.json'));
    });
    
    app.get('/sw.js', (req, res) => {
      res.sendFile(path.join(distPath, 'sw.js'));
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(500).send("Error loading app. Please try again later.");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
