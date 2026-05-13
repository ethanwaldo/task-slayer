import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String }, 
  session: {
    id: { type: String, required: true, unique: true },
    created: { type: Number }
  },
  class_: { type: String },
  monsters: { type: Array, default: [] },
  exp: { type: Number, default: 0 }
});

export const User = mongoose.model('User', UserSchema);
