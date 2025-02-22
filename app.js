import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clientRoutes from './routes/client.routes.js';
import messageRoutes from './routes/message.routes.js'; // Ensure this import is correct
import scheduleRoutes from './routes/schedule.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing Twilio webhook data

// Redirect root URL to frontend
app.get('/', (req, res) => {
  res.redirect('https://chamaradissanayake.github.io/Chatbot-frontend/main/home');
});

// Routes
app.use('/clients', clientRoutes);
app.use('/messages', messageRoutes); // Ensure this is correctly registered
app.use('/schedule', scheduleRoutes);
app.use('/chatbot', chatbotRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});