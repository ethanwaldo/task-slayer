import express from 'express';
import { User } from '../models/schema.js';
import { getProfile } from '../profile.js';
import { isClass } from '../profile.js';
import { auth } from '../auth/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });
  res.json({ result: "success", profile: getProfile(user) });
});

router.post('/class', auth, async (req, res) => {
  const class_ = req.body.class_;
  if (!isClass(class_)) return res.json({ result: "invalid class" });

  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(401).json({ result: "unauthorized" });

  user.class_ = class_;
  await user.save();
  res.json({ result: "success", profile: { displayName: user.username, class_: user.class_, exp: user.exp, stats: user.stats } });
});

export default router;
