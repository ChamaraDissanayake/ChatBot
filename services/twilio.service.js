import schedule from 'node-schedule';
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import db from '../config/firebase.config.js';
import { sendMessage } from './message.service.js';

const scheduledMessagesRef = collection(db, 'scheduledMessages');

// Schedule a message
const scheduleMessage = async (to, body, date) => {
  try {
    console.log(`Scheduling message to ${to} for ${date}`);
    const job = schedule.scheduleJob(date, async () => {
      console.log(`Executing scheduled message to ${to}`);
      await sendMessage(to, body);
    });

    await addDoc(scheduledMessagesRef, { to, body, date, jobId: job.name });
    console.log(`Message scheduled with jobId: ${job.name}`);
    return job;
  } catch (error) {
    console.error('Error scheduling message:', error);
    throw error;
  }
};

// Schedule a voice call (placeholder)
const scheduleVoiceCall = async (to, date) => {
  try {
    console.log(`Scheduling voice call to ${to} for ${date}`);
    const job = schedule.scheduleJob(date, () => {
      console.log(`Calling ${to} at ${date}`);
      // Simulate a voice call request
    });

    await addDoc(scheduledMessagesRef, { to, date, jobId: job.name, type: 'voice' });
    console.log(`Voice call scheduled with jobId: ${job.name}`);
    return job;
  } catch (error) {
    console.error('Error scheduling voice call:', error);
    throw error;
  }
};

// Get all scheduled messages
const getScheduledMessages = async () => {
  try {
    console.log('Fetching scheduled messages...');
    const querySnapshot = await getDocs(scheduledMessagesRef);
    const messages = querySnapshot.docs.map(doc => doc.data());
    console.log('Scheduled messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    throw error;
  }
};

// Cancel a scheduled message
const cancelScheduledMessage = async (jobId) => {
  try {
    console.log(`Canceling job with ID: ${jobId}`);
    const q = query(scheduledMessagesRef, where('jobId', '==', jobId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      schedule.cancelJob(jobId);
      console.log(`Job ${jobId} canceled successfully.`);
    } else {
      console.warn(`No job found with jobId: ${jobId}`);
    }
  } catch (error) {
    console.error('Error canceling scheduled message:', error);
    throw error;
  }
};

export { scheduleMessage, scheduleVoiceCall, getScheduledMessages, cancelScheduledMessage };