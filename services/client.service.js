import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '../config/firebase.config.js';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Normalize phone number using libphonenumber-js
const normalizePhoneNumber = (phoneNumber) => {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);
  if (!parsedNumber || !parsedNumber.isValid()) {
    throw new Error('Invalid phone number');
  }
  return parsedNumber.format('E.164'); // Format as E.164 (e.g., +1234567890)
};

// Get client by phone number
const getClientByPhoneNumber = async (phoneNumber) => {
  try {
    const normalizedNumber = normalizePhoneNumber(phoneNumber);
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('phoneNumber', '==', normalizedNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Client not found');
    }

    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
};

// Add or update a client
const addClient = async (clientData) => {
  try {
    const { phoneNumber } = clientData;
    const normalizedNumber = normalizePhoneNumber(phoneNumber); // Normalize phone number

    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('phoneNumber', '==', normalizedNumber));
    const querySnapshot = await getDocs(q);

    let clientId;
    if (!querySnapshot.empty) {
      // Client exists, update the existing document
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, clientData);
      clientId = docRef.id;
      console.log('Client updated with ID:', clientId); // Debug log
    } else {
      // Client does not exist, create a new document
      const docRef = await addDoc(clientsRef, { ...clientData, phoneNumber: normalizedNumber });
      clientId = docRef.id;
      console.log('Client added with ID:', clientId); // Debug log
    }

    return { id: clientId, ...clientData, phoneNumber: normalizedNumber };
  } catch (error) {
    console.error('Error adding/updating client:', error); // Debug log
    throw error;
  }
};

// Get all clients
const getClients = async () => {
  try {
    const clientsRef = collection(db, 'clients');
    const querySnapshot = await getDocs(clientsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
};

// Update a client by phone number
const updateClient = async (phoneNumber, clientData) => {
  try {
    const normalizedNumber = normalizePhoneNumber(phoneNumber); // Normalize phone number

    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('phoneNumber', '==', normalizedNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Client not found');
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, clientData);
    return { phoneNumber: normalizedNumber, ...clientData };
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// Delete a client by phone number
const deleteClient = async (phoneNumber) => {
  try {
    const normalizedNumber = normalizePhoneNumber(phoneNumber); // Normalize phone number

    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('phoneNumber', '==', normalizedNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Client not found');
    }

    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef);
    return { phoneNumber: normalizedNumber };
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export { addClient, getClients, updateClient, deleteClient, getClientByPhoneNumber };