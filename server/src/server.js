import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Slayer Server is running' });
});

// AI Test Route (Person D)
import { generateMonsterData } from './services/aiService';
app.post('/api/summon', async (req, res) => {
  const { description } = req.body;
  const monster = await generateMonsterData(description);
  res.json(monster);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
