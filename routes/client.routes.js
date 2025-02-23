import express from 'express';
import { addClient, getClients, updateClient, deactivateClient } from '../services/client.service.js';

const router = express.Router();

// Add a new client
router.post('/', async (req, res) => {
  try {
    const client = await addClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await getClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a client by phone number
router.put('/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const client = await updateClient(phoneNumber, req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a client by phone number
router.delete('/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    await deactivateClient(phoneNumber);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;