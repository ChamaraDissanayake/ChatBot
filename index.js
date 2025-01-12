import openai from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
  console.log(colors.bold.green("Welcome to Smart Global Hub! How can I help you today?"));

  const chatHistory = []; // This array stores the conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow("You: "));

    try {
      // Read the chat hitory and add the user input
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: "user", content: userInput });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // It only has small free limit. Need to pay for more
        messages: messages,
      });

      const completionText = completion.choices[0].message.content;

      console.log(colors.green("Bot: ") + completionText);

      // Update history with user input and assistant response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);

      if (userInput.toLowerCase() === "exit") {
        return;
      }
    } catch (error) {
      console.log(colors.red(error));
      return;
    }
  }
}

main();
