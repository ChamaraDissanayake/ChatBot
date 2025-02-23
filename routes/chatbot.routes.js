import express from 'express';
import { getChatResponse, handoverToHuman } from '../services/chatbot.service.js';
const router = express.Router();

// Get chatbot response
router.post('/chat', async (req, res) => {
  try {
    const { userId, userInput } = req.body;
    const { botResponse } = await getChatResponse(userId, userInput);
    res.json({ botResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handover chat to a human
router.post('/handover', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await handoverToHuman(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;