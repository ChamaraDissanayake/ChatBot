import db from '../config/firebase.config.js';
import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
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
      to: `whatsapp:${to}`,
      from: 'whatsapp:+14155238886',
      body,
      direction, // 'outgoing' or 'incoming'
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

// Store incoming messages in Firestore
const storeIncomingMessage = async (from, body) => {
  try {
    // Store the incoming message in Firestore
    await addDoc(collection(db, 'messageLogs'), {
      to: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
      from: `whatsapp:${from}`,
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
    // Find the message in Firestore using messageSid
    const messagesRef = collection(db, 'messageLogs');
    const q = query(messagesRef, where('messageSid', '==', messageSid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update the message status
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
    const q = query(
      messagesRef,
      where('to', '==', `whatsapp:${phoneNumber}`),
      where('from', '==', 'whatsapp:+14155238886'),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const chatHistory = querySnapshot.docs.map(doc => doc.data());

    return chatHistory;
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
};

// Export all functions
export { sendMessage, storeIncomingMessage, handleStatusCallback, getChatHistory };