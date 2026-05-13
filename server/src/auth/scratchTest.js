import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { hashPassword, verifyPassword, signToken, verifyToken } from './passwordHelpers.js';

const run = async () => {
  const pw = 'hunter2';
  const hash = await hashPassword(pw);
  console.log('hash:', hash);
  console.log('verify correct  :', await verifyPassword(pw, hash));
  console.log('verify wrong pw :', await verifyPassword('nope', hash));
  const token = signToken({ username: 'testuser' });
  console.log('token:', token);
  console.log('decoded:', verifyToken(token));
};

run().catch(console.error);
