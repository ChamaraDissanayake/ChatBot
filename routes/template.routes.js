import express from 'express';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../services/template.service.js';

const router = express.Router();

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await getTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new template
router.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    const newTemplate = await createTemplate(name, content);
    res.json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a template
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;
    const updatedTemplate = await updateTemplate(id, name, content);
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTemplate(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;