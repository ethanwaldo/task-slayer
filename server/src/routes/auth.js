import express from 'express';
import crypto from 'crypto';
import { User } from '../models/schema.js';
import { getProfile, isClass } from '../profile.js';
import { SESSION } from '../session.js';

const router = express.Router();
const MIN_PASSWORD_LENGTH = 6;

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

router.post('/register', async (req, res) => {
  const { username, password, class_ } = req.body;
  if (!username || typeof username !== 'string') return res.status(400).json({ error: "Invalid username" });
  if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  if (!isClass(class_)) return res.status(400).json({ error: "Invalid class" });

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Username taken" });

    const sessionToken = generateToken();
    const user = new User({ username, password, class_, sessionToken });
    await user.save();

    res.cookie(SESSION.name, sessionToken, SESSION).json({ result: "success" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  const user = await User.findOne({ username });
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid username or password" });

  const sessionToken = generateToken();
  user.sessionToken = sessionToken;
  await user.save();

  res.cookie(SESSION.name, sessionToken, SESSION).json({ result: "success", profile: getProfile(user) });
});

router.post('/logout', async (req, res) => {
  res.clearCookie(SESSION.name).json({ result: "success" });
});

export default router;
