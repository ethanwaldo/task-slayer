import express from 'express';
import dayjs from 'dayjs';
import { User } from '../models/schema.js';
import { getProfile } from '../profile.js';
import { auth } from '../auth/auth.js';

const router = express.Router();

router.post('/quest/complete', auth, async (req, res) => {
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

  if (user.items?.critBoost && dayjs().isBefore(dayjs(user.items.critBoost))) multiplier *= 1.2;
  const xpMultiplier  = (user.items?.xpBoost   && dayjs().isBefore(dayjs(user.items.xpBoost)))   ? 1.2 : 1;
  const coinMultiplier = (user.items?.coinRush  && dayjs().isBefore(dayjs(user.items.coinRush)))  ? 1.5 : 1;

  const rewards = { easy: [100, 10], medium: [200, 25], hard: [400, 50], boss: [1000, 150] };
  const [baseXp, baseCoins] = rewards[quest.difficulty] || rewards.medium;
  const xpEarned    = Math.round(baseXp    * multiplier * xpMultiplier);
  const coinsEarned = Math.round(baseCoins * multiplier * coinMultiplier);

  user.exp   = (user.exp   || 0) + xpEarned;
  user.coins = (user.coins || 0) + coinsEarned;

  let statGain = 1;
  const c = user.class_;
  if ((c === "Warrior" && statKey === "STR") ||
      (c === "Scholar" && statKey === "INT") ||
      (c === "Monk"    && statKey === "CON") ||
      (c === "Bard"    && statKey === "CHA") ||
      (c === "Rogue"   && statKey === "AGI")) {
    statGain = 2;
  }

  user.stats[statKey] = (user.stats[statKey] || 10) + statGain;

  const level = Math.floor(user.exp / 1000) + 1;
  const titles = [
    [50, "Legendary Slayer"],
    [20, "Elite Slayer"],
    [10, "Veteran Slayer"],
    [5,  "Adept Slayer"],
    [2,  "Novice Slayer"],
    [1,  "Apprentice Slayer"],
  ];
  for (const [lvl, t] of titles) {
    if (level >= lvl) { user.title = t; break; }
  }

  await user.save();
  res.json({ result: "success", slayRating, xpEarned, coinsEarned, statGained: statKey, statAmount: statGain, profile: getProfile(user) });
});

router.post('/tick', auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const { hp, missedDeadlines } = req.body;
  if (typeof hp !== "number" || !Array.isArray(missedDeadlines)) {
    return res.status(400).json({ error: "hp and missedDeadlines required" });
  }

  for (const quest of user.quests) {
    if (missedDeadlines.includes(quest.id)) quest.missedDeadline = true;
  }
  user.hp = hp;
  await user.save();
  res.json({ result: "success" });
});

export default router;
