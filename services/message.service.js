import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import db from '../config/firebase.config.js';
import twilioClient from '../config/twilio.config.js';
import { getClientByPhoneNumber, addClient } from './client.service.js';
import { getChatResponse } from './chatbot.service.js';

const twilioNumber = '+14155238886';
// Send a message and store it in Firestore
const sendMessage = async (to, body, direction = 'outgoing') => {
  try {
    const message = await twilioClient.messages.create({
      body: body,
      from: `whatsapp:${twilioNumber}`,
      to: `whatsapp:${to}`,
    });

    // Store the message in Firestore
    await addDoc(collection(db, 'messageLogs'), {
      to: to,
      from: twilioNumber,
      body,
      direction,
      timestamp: new Date(),
      status: 'sent',
      messageSid: message.sid,
      chatHandover: false, // Default to false
      userId: to, // Add userId (phone number)
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

    // Check if client exists, or create a new one
    let client = await getClientByPhoneNumber(cleanFrom);
    if (!client) {
      // Create a new client with default values
      client = await addClient({ 
        phoneNumber: cleanFrom, 
        name: 'New User', // Default name
        isActive: true, // Default isActive
        chatHandover: false // Default chatHandover
      });
    }

    // Check if the client is active
    if (!client.isActive) {
      console.log(`Client ${cleanFrom} is inactive. Ignoring message.`);
      return; // Exit the function without processing the message
    }

    // Store the incoming message
    await addDoc(collection(db, 'messageLogs'), {
      to: twilioNumber,
      from: cleanFrom,
      body,
      direction: 'incoming',
      timestamp: new Date(),
      status: 'received',
      chatHandover: client.chatHandover || false, // Use existing value or default to false
      userId: cleanFrom,
    });

    // If chat is not handed over, trigger chatbot reply
    if (!client.chatHandover) {
      const { botResponse } = await getChatResponse(cleanFrom, body);
      await sendMessage(cleanFrom, botResponse); // Send chatbot reply
    }
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
      where('userId', '==', phoneNumber), // Filter by userId
      orderBy('timestamp', 'asc') // Order by timestamp
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
};

// Export all functions
export { sendMessage, sendTemplateMessage, storeIncomingMessage, handleStatusCallback, getChatHistory };