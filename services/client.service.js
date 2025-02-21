import db from '../config/firebase.config.js';
import { collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

const addClient = async (clientData) => {
  try {
    console.log('Adding/updating client:', clientData); // Debug log

    // Check if a client with the same phone number already exists
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('phoneNumber', '==', clientData.phoneNumber));
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
      const docRef = await addDoc(clientsRef, clientData);
      clientId = docRef.id;
      console.log('Client added with ID:', clientId); // Debug log
    }

    return { id: clientId, ...clientData };
  } catch (error) {
    console.error('Error adding/updating client:', error); // Debug log
    throw error;
  }
};

const getClients = async () => {
  const snapshot = await getDocs(collection(db, 'clients'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateClient = async (id, clientData) => {
  const clientRef = doc(db, 'clients', id);
  await updateDoc(clientRef, clientData);
  return { id, ...clientData };
};

const deleteClient = async (id) => {
  const clientRef = doc(db, 'clients', id);
  await deleteDoc(clientRef);
  return { id };
};

export { addClient, getClients, updateClient, deleteClient };