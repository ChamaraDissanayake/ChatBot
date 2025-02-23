import openai from '../config/openai.config.js';
import { getClientByPhoneNumber, updateClient } from './client.service.js';
import { getChatHistory } from './message.service.js';

// Get chatbot response
const getChatResponse = async (userId, userInput) => {
  try {
    // Check if the chat has been handed over to a human
    const client = await getClientByPhoneNumber(userId);

    if (client.chatHandover) {
      return { botResponse: 'A human agent will assist you shortly.' };
    }

    // Retrieve chat history from messageLogs
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
      chatHistory = [systemMessage];
    }

    // Transform chatHistory into the correct format for OpenAI API
    const messages = chatHistory.map(message => {
      if (message.direction === 'incoming') {
        return { role: 'user', content: message.body }; // User messages
      } else if (message.direction === 'outgoing') {
        return { role: 'assistant', content: message.body }; // Assistant messages
      } else if (message.role === 'system') {
        return { role: 'system', content: message.content }; // System messages
      }
    }).filter(Boolean); // Remove any undefined entries

    // Add the new user input to the messages array
    messages.push({ role: 'user', content: userInput });

    // Call OpenAI API to get a response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use your preferred model
      messages: messages,
    });

    const botResponse = completion.choices[0].message.content;

    return { botResponse };
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
};

// Handover chat to a human
const handoverToHuman = async (userId) => {
  try {
    await updateClient(userId, { chatHandover: true });
    return { success: true, message: 'Chat handed over to a human agent.' };
  } catch (error) {
    console.error('Error handing over chat:', error);
    throw error;
  }
};

export { getChatResponse, handoverToHuman };