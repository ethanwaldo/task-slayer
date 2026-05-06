import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { isClass } from './types.js';
/** @import { Class, Guest, Session, User } from "./types.js" */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const sessionCookieName = "session";
const sessionMaxAge = 7 * 24 * 60 * 60 * 1000;

/** @type {express.CookieOptions} */
const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: sessionMaxAge,
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Slayer Server is running' });
});

import { generateMonsterData } from './services/aiService.js';
app.post('/api/summon', async (req, res) => {
  const { description } = req.body;
  const monster = await generateMonsterData(description);
  res.json(monster);
});

// Authentication & Session
// Since this is a simple "Username only" flow, we'll store the username in the session cookie
import { User } from './models/User.js';

app.post('/api/auth/register', async (req, res) => {
  const { username, class_ } = req.body;
  if (!username || !isClass(class_)) return res.status(400).json({ error: "Invalid username or class" });

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username taken" });

    const user = new User({ username, class_, exp: 0, stats: { STR: 10, INT: 10, AGI: 10, CON: 10, CHA: 10 } });
    await user.save();
    
    res.cookie(sessionCookieName, username, sessionCookieOptions).json({ result: "success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.cookie(sessionCookieName, username, sessionCookieOptions).json({ result: "success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(sessionCookieName).json({ result: "success" });
});

// Profile and Quests
app.get('/api/profile', async (req, res) => {
  const username = req.cookies[sessionCookieName];
  if (!username) return res.status(401).json({ result: "unauthorized" });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  res.json({
    result: "success",
    profile: {
      displayName: user.username,
      class_: user.class_,
      monsters: user.monsters || [],
      exp: user.exp,
      stats: user.stats
    }
  });
});

app.post('/api/quest/complete', async (req, res) => {
  const username = req.cookies[sessionCookieName];
  if (!username) return res.status(401).json({ result: "unauthorized" });
  
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const { stat } = req.body;
  const statKey = stat || "INT";
  
  user.exp = (user.exp || 0) + 150;
  
  let statGain = 1;
  const c = user.class_;
  if ((c === "Warrior" && statKey === "STR") ||
      (c === "Scholar" && statKey === "INT") ||
      (c === "Monk" && statKey === "CON") ||
      (c === "Bard" && statKey === "CHA") ||
      (c === "Rogue" && statKey === "AGI")) {
    statGain = 2;
  }
  
  user.stats[statKey] = (user.stats[statKey] || 10) + statGain;
  
  await user.save();
  res.json({ 
    result: "success", 
    profile: { displayName: user.username, class_: user.class_, exp: user.exp, stats: user.stats }
  });
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find().sort({ exp: -1 }).limit(50);
    const leaderboard = users.map((user) => ({
      id: user._id,
      name: user.username,
      classType: user.class_,
      exp: user.exp || 0,
    }));
    res.json({ result: "success", leaderboard });
  } catch (error){
    res.status(500).json({ result: "error" });
  }
});

// Start Server & Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
