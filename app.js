import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clientRoutes from './routes/client.routes.js';
import messageRoutes from './routes/message.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing Twilio webhook data

// Routes
app.use('/clients', clientRoutes);
app.use('/messages', messageRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/chatbot', chatbotRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});