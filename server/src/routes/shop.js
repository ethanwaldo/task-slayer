import express from 'express';
import dayjs from 'dayjs';
import { User } from '../models/schema.js';
import { getProfile, isClass } from '../profile.js';
import { auth } from '../auth/auth.js';

const router = express.Router();

router.post('/buy', auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const { name, price, class_ } = req.body;
  if (typeof name !== "string" || typeof price !== "number") {
    return res.status(400).json({ error: "name and price required" });
  }
  if ((user.coins || 0) < price) return res.status(400).json({ error: "Not enough coins" });

  user.coins = (user.coins || 0) - price;

  if (isClass(class_)) {
    user.class_ = class_;
  } else {
    switch (name) {
      case "Health Potion":
        user.hp = 10 + Math.floor((user.exp || 0) / 1000);
        break;
      case "XP Boost":
        user.items.xpBoost = dayjs().add(1, "day").toDate();
        break;
      case "Critical Hit Boost":
        user.items.critBoost = dayjs().add(1, "day").toDate();
        break;
      case "Coin Rush":
        user.items.coinRush = dayjs().add(1, "day").toDate();
        break;
      case "Tome of Knowledge":
        user.exp = (user.exp || 0) + 500;
        break;
      case "Name Color":
        if (user.items.nameColor) return res.status(400).json({ error: "Already owned" });
        user.items.nameColor = true;
        break;
    }
  }

  await user.save();
  res.json({ result: "success", profile: getProfile(user) });
});

export default router;
