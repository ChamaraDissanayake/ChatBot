import openai from '../config/openai.config.js';

// In-memory storage for chat history
const chatHistoryMap = {};

const getChatResponse = async (userId, userInput) => {
  try {
    // Retrieve or initialize chat history for the user
    if (!chatHistoryMap[userId]) {
      chatHistoryMap[userId] = [
        {
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
        },
      ];
    }
    const chatHistory = chatHistoryMap[userId];

    // Prepare messages array for the OpenAI API
    const messages = chatHistory.map(({ role, content }) => ({ role, content }));
    messages.push({ role: 'user', content: userInput });

    // Call OpenAI API to get a response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use your preferred model
      messages: messages,
    });

    const botResponse = completion.choices[0].message.content;

    // Add user input and bot response to chat history
    chatHistory.push({ role: 'user', content: userInput });
    chatHistory.push({ role: 'assistant', content: botResponse });

    return { botResponse };
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
};

export { getChatResponse };