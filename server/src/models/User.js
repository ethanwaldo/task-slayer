import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  description: { type: String, required: true },
  monsterName: { type: String, required: true },
  flavorText: { type: String, default: "" },
  type: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  primaryStat: { type: String, enum: ["STR", "INT", "AGI", "CON", "CHA"], default: "INT" },
  hp: { type: Number, default: 100 },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  class_: { type: String, enum: ["Warrior", "Scholar", "Bard", "Monk", "Rogue"], required: true },
  exp: { type: Number, default: 0 },
  stats: {
    STR: { type: Number, default: 10 },
    INT: { type: Number, default: 10 },
    AGI: { type: Number, default: 10 },
    CON: { type: Number, default: 10 },
    CHA: { type: Number, default: 10 }
  },
  monsters: { type: Array, default: [] },
  quests: { type: [questSchema], default: [] }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
