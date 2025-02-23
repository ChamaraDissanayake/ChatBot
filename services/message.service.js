import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import db from '../config/firebase.config.js';
import twilioClient from '../config/twilio.config.js';

// Send a message and store it in Firestore
const sendMessage = async (to, body, direction = 'outgoing') => {
  try {
    const message = await twilioClient.messages.create({
      body: body,
      from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
      to: `whatsapp:${to}`,
    });

    // Store the message in Firestore
    await addDoc(collection(db, 'messageLogs'), {
      to: to,
      from: '+14155238886',
      body,
      direction,
      timestamp: new Date(),
      status: 'sent',
      messageSid: message.sid,
    });

    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Send a template message
const sendTemplateMessage = async (to, clientName) => {
  const body = `Hello ${clientName}, this is your AI sales assistant. Let me know if you need assistance!`;
  return await sendMessage(to, body);
};

// Store incoming messages in Firestore
const storeIncomingMessage = async (from, body) => {
  try {
    // Remove "whatsapp:" prefix
    const cleanFrom = from.replace(/^whatsapp:/, '');

    await addDoc(collection(db, 'messageLogs'), {
      to: '+14155238886',
      from: cleanFrom,
      body,
      direction: 'incoming',
      timestamp: new Date(),
      status: 'received',
    });
  } catch (error) {
    console.error('Error storing incoming message:', error);
    throw error;
  }
};

// Handle status callbacks from Twilio
const handleStatusCallback = async (messageSid, status) => {
  try {
    const messagesRef = collection(db, 'messageLogs');
    const q = query(messagesRef, where('messageSid', '==', messageSid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { status });
      console.log(`Updated message status for SID ${messageSid} to ${status}`);
    } else {
      console.error(`Message with SID ${messageSid} not found`);
    }
  } catch (error) {
    console.error('Error handling status callback:', error);
    throw error;
  }
};

// Get chat history for a specific phone number
const getChatHistory = async (phoneNumber) => {
  try {
    const messagesRef = collection(db, 'messageLogs');

    // Query messages where "to" is the phoneNumber
    const q1 = query(messagesRef, where('to', '==', phoneNumber));
    const snapshot1 = await getDocs(q1);
    
    // Query messages where "from" is the phoneNumber
    const q2 = query(messagesRef, where('from', '==', phoneNumber));
    const snapshot2 = await getDocs(q2);

    // Merge both query results
    let messages = [
      ...snapshot1.docs.map(doc => doc.data()),
      ...snapshot2.docs.map(doc => doc.data())
    ];

    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);

    return messages;
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
};


// Export all functions
export { sendMessage, sendTemplateMessage, storeIncomingMessage, handleStatusCallback, getChatHistory };