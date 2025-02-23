import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '../config/firebase.config.js';

const templatesRef = collection(db, 'templates');

// Get all templates
const getTemplates = async () => {
  try {
    const querySnapshot = await getDocs(templatesRef);
    const templates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

// Create a new template
const createTemplate = async (name, content) => {
  try {
    const newTemplate = await addDoc(templatesRef, { name, content });
    return { id: newTemplate.id, name, content };
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

// Update a template
const updateTemplate = async (id, name, content) => {
  try {
    await updateDoc(doc(templatesRef, id), { name, content });
    return { id, name, content };
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};

// Delete a template
const deleteTemplate = async (id) => {
  try {
    await deleteDoc(doc(templatesRef, id));
    return { message: 'Template deleted successfully' };
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

export { getTemplates, createTemplate, updateTemplate, deleteTemplate };