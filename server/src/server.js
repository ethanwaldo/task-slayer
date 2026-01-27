require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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
const aiService = require('./services/aiService');
app.post('/api/summon', async (req, res) => {
  const { description } = req.body;
  const monster = await aiService.generateMonsterData(description);
  res.json(monster);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
