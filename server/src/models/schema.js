import mongoose from 'mongoose';

const statBlock = {
  STR: { type: Number, default: 5 },
  INT: { type: Number, default: 5 },
  AGI: { type: Number, default: 5 },
  CON: { type: Number, default: 5 },
  CHA: { type: Number, default: 5 },
};

const questSchema = new mongoose.Schema({
  task:            { type: String, required: true },
  monsterName:     { type: String, required: true },
  description:     { type: String, default: "" },
  type:            { type: String, default: "" },
  imageUrl:        { type: String, default: "" },
  primaryStat:     { type: String, enum: ["STR", "INT", "AGI", "CON", "CHA"], default: "INT" },
  difficulty:      { type: String, enum: ["easy", "medium", "hard", "boss"], default: "medium" },
  monsterStats:    statBlock,
  hp:              { type: Number, default: 100 },
  status:          { type: String, enum: ["active", "completed"], default: "active" },
  completedAt:     { type: Date, default: null },
  deadline:        { type: Date, default: null },
  missedDeadline:  { type: Boolean, default: false },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username:      { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  sessionToken:  { type: String, default: null },
  class_:        { type: String, enum: ["Warrior", "Scholar", "Bard", "Monk", "Rogue"], required: true },
  title:         { type: String, default: "Apprentice Slayer" },
  hp:            { type: Number, default: 10 },
  exp:           { type: Number, default: 0, index: true },
  coins:         { type: Number, default: 0 },
  stats: {
    STR: { type: Number, default: 10 },
    INT: { type: Number, default: 10 },
    AGI: { type: Number, default: 10 },
    CON: { type: Number, default: 10 },
    CHA: { type: Number, default: 10 },
  },
  items: {
    xpBoost:    { type: Date, default: null },
    critBoost:  { type: Date, default: null },
    coinRush:   { type: Date, default: null },
    nameColor:  { type: Boolean, default: false },
  },
  monsters:  { type: Array, default: [] },
  quests:    { type: [questSchema], default: [] },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
