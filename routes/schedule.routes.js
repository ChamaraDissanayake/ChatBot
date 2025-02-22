import express from 'express';
import { scheduleMessage, getScheduledMessages } from '../services/twilio.service.js';

const router = express.Router();

// Schedule a message
router.post('/', async (req, res) => {
  try {
    const { to, body, date } = req.body;
    const job = scheduleMessage(to, body, date);
    res.json({ success: true, jobId: job.name });
  } catch (error) {
    console.error('Error scheduling message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all scheduled messages
router.get('/', async (req, res) => {
  try {
    const scheduledMessages = getScheduledMessages();
    res.json(scheduledMessages);
  } catch (error) {
    console.error('Error retrieving scheduled messages:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;