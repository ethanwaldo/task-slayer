import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { User } from '../models/User.js';
import { hashPassword } from './passwordHelpers.js';

const TEST_USERNAME = '__schema_test_user__';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('connected to MongoDB');

  await User.deleteOne({ username: TEST_USERNAME });

  const passwordHash = await hashPassword('hunter2');
  const user = new User({
    username: TEST_USERNAME,
    passwordHash,
    class_: 'Scholar',
    quests: [{
      description: 'Finish calculus homework',
      monsterName: 'The Logic Demon',
      flavorText: 'A whisper of regret',
      type: 'Mental',
      primaryStat: 'INT',
      hp: 120
    }]
  });
  await user.save();
  console.log('created user with _id:', user._id.toString());

  const found = await User.findOne({ username: TEST_USERNAME });
  console.log('passwordHash present:', !!found.passwordHash);
  console.log('quests count       :', found.quests.length);
  console.log('first quest status :', found.quests[0].status);
  console.log('first quest _id    :', found.quests[0]._id.toString());
  console.log('createdAt present  :', !!found.quests[0].createdAt);

  await User.deleteOne({ username: TEST_USERNAME });
  console.log('cleaned up test user');

  await mongoose.disconnect();
};

run().catch(async (e) => {
  console.error('TEST FAILED:', e.message);
  await mongoose.disconnect();
  process.exit(1);
});
