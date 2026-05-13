import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String }, 
  session: {
    id: { type: String, required: true, unique: true },
    created: { type: Number }
  },
  class_: { type: String },
  monsters: { type: Array, default: [] },
  exp: { type: Number, default: 0 },
  stats: {
    STR: { type: Number, default: 10 },
    AGI: { type: Number, default: 10 },
    INT: { type: Number, default: 10 },
    CON: { type: Number, default: 10 },
    CHA: { type: Number, default: 10 }
  }
});

export const User = mongoose.model('User', UserSchema);
