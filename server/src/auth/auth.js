import { User } from '../models/schema.js';
import { SESSION } from '../session.js';

export const auth = async (req, res, next) => {
  const token = req.cookies?.[SESSION.name];
  if (!token) return res.status(401).json({ result: 'unauthorized' });

  const user = await User.findOne({ sessionToken: token });
  if (!user) return res.status(401).json({ result: 'unauthorized' });

  req.user = { username: user.username, userId: user._id };
  next();
};
