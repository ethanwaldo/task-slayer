import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { isClass } from './types';
import { getProfile } from './profile';
/** @import { Class, Guest, Session, User } from "./types" */

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
  secure: process.env.NODE_ENV === "production",
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

import { generateMonsterData } from './services/aiService';

// Authentication & Session
import { User } from './models/User.js';
import { hashPassword, verifyPassword, signToken } from './auth/passwordHelpers.js';
import { authMiddleware } from './auth/authMiddleware.js';

const MIN_PASSWORD_LENGTH = 6;

app.post('/api/auth/register', async (req, res) => {
  const { username, password, class_ } = req.body;
  if (!username || typeof username !== 'string') return res.status(400).json({ error: "Invalid username" });
  if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  if (!isClass(class_)) return res.status(400).json({ error: "Invalid class" });

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username taken" });

    const passwordHash = await hashPassword(password);
    const user = new User({ username, passwordHash, class_ });
    await user.save();

    const token = signToken({ username: user.username, userId: user._id.toString() });
    res.cookie(sessionCookieName, token, sessionCookieOptions).json({
      result: "success",
      profile: getProfile(user)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  try {
    const user = await User.findOne({ username });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid username or password" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid username or password" });

    const token = signToken({ username: user.username, userId: user._id.toString() });
    res.cookie(sessionCookieName, token, sessionCookieOptions).json({
      result: "success",
      profile: getProfile(user)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(sessionCookieName).json({ result: "success" });
});

// Profile and Quests
app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  res.json({
    result: "success",
    profile: getProfile(user)
  });
});

app.post("/api/class", authMiddleware, async (req, res) => {
  const class_ = req.body.class_;
  if (!isClass(class_)) {
    res.json({ result: "invalid class" });
    return;
  }
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  user.class_ = class_;
  await user.save();
  res.json({ result: "success", profile: { displayName: user.username, class_: user.class_, exp: user.exp, stats: user.stats } });
});

app.post('/api/summon', authMiddleware, async (req, res) => {
  const { description } = req.body;
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: "Description required" });
  }

  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(401).json({ result: "unauthorized" });

    const monster = await generateMonsterData(description);

    user.quests.push({
      description,
      monsterName: monster.name,
      flavorText: monster.flavorText || "",
      type: monster.type || "",
      imageUrl: monster.imageUrl || "",
      primaryStat: monster.primaryStat || "INT",
      difficulty: monster.difficulty || "medium",
      monsterStats: monster.monsterStats || { STR: 5, INT: 5, AGI: 5, CON: 5, CHA: 5 },
      status: "active",
    });
    await user.save();

    const saved = user.quests[user.quests.length - 1];
    res.json({ result: "success", quest: saved });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/quests', authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const activeQuests = user.quests.filter(q => q.status === "active");
  res.json({ result: "success", quests: activeQuests });
});

app.post('/api/quest/complete', authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const { questId } = req.body;
  if (!questId) return res.status(400).json({ error: "questId required" });

  const quest = user.quests.id(questId);
  if (!quest) return res.status(404).json({ error: "Quest not found" });
  if (quest.status === "completed") return res.status(400).json({ error: "Quest already completed" });

  quest.status = "completed";
  quest.completedAt = new Date();

  const statKey = quest.primaryStat || "INT";

  // combat roll: compare player stat to monster stat
  const playerStat = user.stats[statKey] || 10;
  const monsterStat = (quest.monsterStats && quest.monsterStats[statKey]) || 5;

  let slayRating = "normal";
  let multiplier = 1;
  if (playerStat >= monsterStat * 2) {
    slayRating = "critical";
    multiplier = 2;
  } else if (playerStat >= monsterStat) {
    slayRating = "normal";
    multiplier = 1.5;
  } else {
    slayRating = "weak";
    multiplier = 1;
  }

  // rewards scale with difficulty
  const rewards = { easy: [100, 10], medium: [200, 25], hard: [400, 50], boss: [1000, 150] };
  const [baseXp, baseCoins] = rewards[quest.difficulty] || rewards.medium;
  const xpEarned = Math.round(baseXp * multiplier);
  const coinsEarned = Math.round(baseCoins * multiplier);

  user.exp = (user.exp || 0) + xpEarned;
  user.coins = (user.coins || 0) + coinsEarned;

  // stat gain (class bonus still applies)
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

  // update title based on level
  const level = Math.floor(user.exp / 1000) + 1;
  const titles = [
    [50, "Legendary Slayer"],
    [20, "Elite Slayer"],
    [10, "Veteran Slayer"],
    [5, "Adept Slayer"],
    [2, "Novice Slayer"],
    [1, "Apprentice Slayer"]
  ];
  for (const [lvl, t] of titles) {
    if (level >= lvl) { user.title = t; break; }
  }

  await user.save();
  res.json({
    result: "success",
    slayRating,
    xpEarned,
    coinsEarned,
    statGained: statKey,
    statAmount: statGain,
    profile: { displayName: user.username, class_: user.class_, exp: user.exp, stats: user.stats, coins: user.coins, title: user.title, level }
  });
});

app.delete('/api/quest/:id', authMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const quest = user.quests.id(req.params.id);
  if (!quest) return res.status(404).json({ error: "Quest not found" });

  quest.deleteOne();
  await user.save();
  res.json({ result: "success" });
});

// Getting saved users from data file (Anthony's leaderboard)
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find().sort({ exp: -1 }).limit(50);
    const leaderboard = users.map((user) => ({
      id: user._id,
      name: user.username,
      classType: user.class_,
      exp: user.exp || 0,
      title: user.title || "Apprentice Slayer",
      level: Math.floor((user.exp || 0) / 1000) + 1,
    }));
    res.json({ result: "success", leaderboard });
  } catch (error){
    console.error("Failed to load leaderboard:", error);
    res.status(500).json({
      result: "error",
      message: "Failed to load leaderboard",
    });
  }
});

// Start Server
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err);
});
