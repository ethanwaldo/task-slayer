import express from 'express';
import { User } from '../models/schema.js';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ exp: -1 }).limit(50);
    const leaderboard = users.map(user => ({
      id: user._id,
      name: user.username,
      classType: user.class_,
      exp: user.exp || 0,
      title: user.title || "Apprentice Slayer",
      level: Math.floor((user.exp || 0) / 1000) + 1,
      nameColor: user.items?.nameColor || false,
    }));
    res.json({ result: "success", leaderboard });
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    res.status(500).json({ result: "error", message: "Failed to load leaderboard" });
  }
});

export default router;
