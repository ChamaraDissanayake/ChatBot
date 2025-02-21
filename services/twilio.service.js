import schedule from 'node-schedule';
import twilioClient from '../config/twilio.config.js';

const scheduledMessages = [];

const scheduleMessage = (to, body, date) => {
  const job = schedule.scheduleJob(date, () => {
    twilioClient.messages.create({
      body: body,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    });
  });
  scheduledMessages.push({ jobId: job.name, to, body, date });
  return job;
};

const getScheduledMessages = () => {
  return scheduledMessages;
};

export { scheduleMessage, getScheduledMessages };