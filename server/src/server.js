import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { isClass } from './types';
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

// AI Test Route (Person D)
import { generateMonsterData } from './services/aiService';
import { generateGuest, getUserBySessionId } from './user';
import { getProfile } from './profile';
import dataFile from './dataFile';
app.post('/api/summon', async (req, res) => {
  const { description } = req.body;
  const monster = await generateMonsterData(description);
  res.json(monster);
});

app.get('/api/profile', async (req, res) => {
  const sessionId = req.cookies[sessionCookieName];
  if (sessionId !== undefined) {
    const foundUser = await getUserBySessionId(sessionId);
    if (foundUser) {
      res.json({
        result: "success",
        profile: getProfile(foundUser),
      });
    } else {
      res.json({ result: "session expired" });
    }
  } else {
    const guest = await generateGuest();
    await dataFile.addUser(guest);
    res
      .cookie(sessionCookieName, guest.session.id, sessionCookieOptions)
      .json({ result: "success", profile: getProfile(guest)});
  }
});

app.post("/api/class", async (req, res) => {
  const class_ = req.body.class_;
  if (!isClass(class_)) {
    res.json({ result: "invalid class" });
    return;
  }
  const sessionId = req.cookies[sessionCookieName];
  if (sessionId !== undefined) {
    const foundUser = await getUserBySessionId(sessionId);
    if (foundUser !== undefined) {
      foundUser.class_ = class_;
      await dataFile.updateUser(foundUser);
      res.json({ result: "success", profile: getProfile(foundUser) });
    } else {
      res.json({ result: "session expired" });
    }
  } else {
    const guest = await generateGuest();
    guest.class_ = class_;
    await dataFile.addUser(guest);
    res
      .cookie(sessionCookieName, guest.session.id, sessionCookieOptions)
      .json({ result: "success", profile: getProfile(guest) });
  }
});

// Getting saved users from data file
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await dataFile.getUsers();

    // Convert user objects into data for leaderboard page
    const leaderboard = users
    .map((user) => ({
      id: user.session.id,
      name: user.name ?? "Guest Slayer",
      classType: user.class_ ?? "Unselected",
      exp: user.exp ?? 0,
    }))

    .sort((a, b) => b.exp - a.exp); // Sort users from highest -> lowest

    // Formatted leaderboard data is sent to frontend
    res.json({
      result: "success",
      leaderboard,
    });
  }
  // Server-side debugging & frontend
  catch (error){
    console.error("Failed to load leaderboard:", error);
    res.status(500).json({
      result: "error",
      message: "Failed to load leaderboard",
    });
  }
});

app.post("/api/quest/complete", async (req, res) => {
  const sessionId = req.cookies[sessionCookieName];
  if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

  const foundUser = await getUserBySessionId(sessionId);
  if (!foundUser) return res.status(401).json({ error: "Session expired" });

  foundUser.exp = (foundUser.exp || 0) + 150;

  if (!foundUser.stats) {
    foundUser.stats = { STR: 10, AGI: 10, INT: 10, CON: 10, CHA: 10 };
  }

  const statsList = ["STR", "AGI", "INT", "CON", "CHA"];
  const randomStat = req.body.stat && statsList.includes(req.body.stat) 
    ? req.body.stat 
    : statsList[Math.floor(Math.random() * statsList.length)];
  let statGain = 1;

  const c = foundUser.class_;
  if ((c === "Warrior" && randomStat === "STR") ||
      (c === "Scholar" && randomStat === "INT") ||
      (c === "Monk" && randomStat === "CON") ||
      (c === "Bard" && randomStat === "CHA") ||
      (c === "Rogue" && randomStat === "AGI")) {
    statGain = 2; // +100% bonus
  }

  foundUser.stats[randomStat] += statGain;

  await dataFile.updateUser(foundUser);
  res.json({ result: "success", exp: foundUser.exp, statGained: randomStat, amount: statGain });
});

// --- NEW AUTHENTICATION ROUTES ---
import { User } from './models/User.js';

app.post('/api/auth/register', async (req, res) => {
  const { username, class_ } = req.body;
  if (!username || !isClass(class_)) return res.status(400).json({ error: "Invalid username or class" });

  try {
    const existing = await User.findOne({ "session.id": username });
    if (existing) return res.status(400).json({ error: "Username taken" });

    const newUser = new User({ 
      name: username, 
      session: { id: username, created: Date.now() },
      class_: class_,
      exp: 0,
      monsters: []
    });
    await newUser.save();
    
    res.cookie(sessionCookieName, username, sessionCookieOptions).json({ result: "success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ "session.id": username });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.cookie(sessionCookieName, username, sessionCookieOptions).json({ result: "success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(sessionCookieName).json({ result: "success" });
});
// ---------------------------------

// Start Server
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err);
});
