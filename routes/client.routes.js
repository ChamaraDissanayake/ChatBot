import express from 'express';
import { addClient, getClients, updateClient, deleteClient } from '../services/client.service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const client = await addClient(req.body);
  res.status(201).json(client);
});

router.get('/', async (req, res) => {
  const clients = await getClients();
  res.json(clients);
});

router.put('/:id', async (req, res) => {
  const client = await updateClient(req.params.id, req.body);
  res.json(client);
});

router.delete('/:id', async (req, res) => {
  await deleteClient(req.params.id);
  res.status(204).send();
});

export default router;