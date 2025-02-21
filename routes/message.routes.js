import express from 'express';
import { storeIncomingMessage, handleStatusCallback } from '../services/message.service.js';

const router = express.Router();

// Handle incoming messages (Twilio webhook)
router.post('/incoming', async (req, res) => {
  const { From, Body } = req.body; // Twilio sends 'From' and 'Body' in the request
  try {
    await storeIncomingMessage(From, Body); // Store the message in Firestore
    res.status(200).send('<Response></Response>'); // Respond to Twilio
  } catch (error) {
    console.error('Error handling incoming message:', error);
    res.status(500).send('<Response></Response>');
  }
});

// Handle status callbacks (Twilio webhook)
router.post('/status', async (req, res) => {
  const { MessageStatus, MessageSid } = req.body; // Twilio sends status updates
  try {
    await handleStatusCallback(MessageSid, MessageStatus); // Update message status in Firestore
    res.status(200).send('<Response></Response>'); // Respond to Twilio
  } catch (error) {
    console.error('Error handling status callback:', error);
    res.status(500).send('<Response></Response>');
  }
});

export default router;