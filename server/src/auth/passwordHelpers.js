import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

export const hashPassword = (plainPassword) =>
  bcrypt.hash(plainPassword, SALT_ROUNDS);

export const verifyPassword = (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);

export const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.verify(token, secret);
};
