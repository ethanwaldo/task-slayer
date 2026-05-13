import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  class_: { type: String, enum: ["Warrior", "Scholar", "Bard", "Monk", "Rogue"], required: true },
  exp: { type: Number, default: 0 },
  stats: {
    STR: { type: Number, default: 10 },
    INT: { type: Number, default: 10 },
    AGI: { type: Number, default: 10 },
    CON: { type: Number, default: 10 },
    CHA: { type: Number, default: 10 }
  },
  monsters: { type: Array, default: [] }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
