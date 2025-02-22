import openai from '../config/openai.config.js';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import db from '../config/firebase.config.js';

// Store chat history in Firestore
const storeChatHistory = async (userId, role, content) => {
  await addDoc(collection(db, 'chatHistory'), {
    userId,
    role,
    content,
    timestamp: new Date(),
  });
};

// Get chat history from Firestore
const getChatHistory = async (userId) => {
  const chatHistoryRef = collection(db, 'chatHistory');
  const q = query(chatHistoryRef, where('userId', '==', userId), orderBy('timestamp', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// Get chatbot response
const getChatResponse = async (userId, userInput) => {
  try {
    // Retrieve chat history from Firestore
    let chatHistory = await getChatHistory(userId);

    // Initialize system message if no history exists
    if (chatHistory.length === 0) {
      const systemMessage = {
        role: 'system',
        content: `You are an AI assistant for XYZ Corporation.

        Company Overview:
        - XYZ Corporation specializes in providing software solutions and visa-related services.
        - Branches: Dubai, Sharjah, and Abu Dhabi.
        - Employee Count: 50 staff members.
        - Services: Visa processing, renewals, cancellations, and general consulting.

        Key Information:
        - Refund Policy: Customers can request a refund within 30 days of purchase under certain conditions.
        - Customer Support: Available 24/7 via our website or helpline.
        - Premium Plans: Include priority visa services, analytics, and extended support.

        Guidelines for responses:
        - Provide short, direct answers (no more than 2 sentences).
        - Do not include greetings in responses.`,
      };
      await storeChatHistory(userId, systemMessage.role, systemMessage.content);
      chatHistory = [systemMessage];
    }

    // Prepare messages array for the OpenAI API
    const messages = chatHistory.map(({ role, content }) => ({ role, content }));
    messages.push({ role: 'user', content: userInput });

    // Call OpenAI API to get a response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use your preferred model
      messages: messages,
    });

    const botResponse = completion.choices[0].message.content;

    // Store user input and bot response in Firestore
    await storeChatHistory(userId, 'user', userInput);
    await storeChatHistory(userId, 'assistant', botResponse);

    return { botResponse };
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
};

export { getChatResponse };