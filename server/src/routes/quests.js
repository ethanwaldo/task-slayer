import express from 'express';
import { User } from '../models/schema.js';
import { STAT_NAMES } from '../profile.js';
import { auth } from '../auth/auth.js';
import { generateMonsterData } from '../services/monster.js';

const router = express.Router();

router.post('/summon', auth, async (req, res) => {
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
    res.json({ result: "success", quest: { ...saved.toObject(), primaryStat: STAT_NAMES[saved.primaryStat] || saved.primaryStat } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/quests', auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const activeQuests = user.quests
    .filter(q => q.status === "active")
    .map(q => ({ ...q.toObject(), primaryStat: STAT_NAMES[q.primaryStat] || q.primaryStat }));
  res.json({ result: "success", quests: activeQuests });
});

router.delete('/quest/:id', auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const index = user.quests.findIndex(q => q.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Quest not found" });

  user.quests.splice(index, 1);
  await user.save();
  res.json({ result: "success" });
});

router.patch('/quest', auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  const { id, deadline } = req.body;
  if (!id) return res.status(400).json({ error: "id required" });

  const quest = user.quests.id(id);
  if (!quest) return res.status(404).json({ error: "Quest not found" });

  quest.deadline = deadline;
  quest.missedDeadline = false;
  await user.save();
  res.json({ result: "success" });
});

export default router;
