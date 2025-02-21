import express from 'express';
import { getChatResponse } from '../services/chatbot.service.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { userId, userInput } = req.body;
    const { botResponse } = await getChatResponse(userId, userInput);
    res.json({ botResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;