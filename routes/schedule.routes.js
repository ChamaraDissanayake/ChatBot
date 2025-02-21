import express from 'express';
import { scheduleMessage, getScheduledMessages } from '../services/twilio.service.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { to, body, date } = req.body;
  const job = scheduleMessage(to, body, date);
  res.json({ success: true, jobId: job.name });
});

router.get('/', (req, res) => {
  const scheduledMessages = getScheduledMessages();
  res.json(scheduledMessages);
});

export default router;