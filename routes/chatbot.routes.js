import express from 'express';
import { getChatResponse } from '../services/chatbot.service.js';
import { updateClient } from '../services/client.service.js'
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

// Toggle handover between chatbot and human
router.post('/handover', async (req, res) => {
  try {
    const { userId, chatHandover } = req.body; // chatHandover is a boolean
    await updateClient(userId, { chatHandover }); // Update the chatHandover field
    
    res.json({ 
      success: true, 
      message: chatHandover 
        ? 'Chat handed over to a human agent.' 
        : 'Chat reverted to chatbot.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;