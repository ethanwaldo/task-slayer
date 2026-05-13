import { verifyToken } from './passwordHelpers.js';

const SESSION_COOKIE = 'session';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return res.status(401).json({ result: 'unauthorized' });

  try {
    const payload = verifyToken(token);
    req.user = { username: payload.username, userId: payload.userId };
    next();
  } catch {
    return res.status(401).json({ result: 'unauthorized' });
  }
};
