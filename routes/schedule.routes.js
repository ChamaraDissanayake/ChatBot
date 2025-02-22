import express from 'express';
import { scheduleMessage, getScheduledMessages, cancelScheduledMessage } from '../services/twilio.service.js';

const router = express.Router();

// Schedule a message
router.post('/', async (req, res) => {
  try {
    const { to, body, date } = req.body;
    const job = await scheduleMessage(to, body, date);
    res.json({ success: true, jobId: job.name });
  } catch (error) {
    console.error('Error scheduling message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all scheduled messages
router.get('/', async (req, res) => {
  try {
    const scheduledMessages = await getScheduledMessages();
    res.json(scheduledMessages);
  } catch (error) {
    console.error('Error retrieving scheduled messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel a scheduled message
router.delete('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    await cancelScheduledMessage(jobId);
    res.status(204).send();
  } catch (error) {
    console.error('Error canceling scheduled message:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;