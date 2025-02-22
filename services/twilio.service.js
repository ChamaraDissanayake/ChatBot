import schedule from 'node-schedule';
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import db from '../config/firebase.config.js';
import { sendMessage } from './message.service.js';

const scheduledMessagesRef = collection(db, 'scheduledMessages');

// Schedule a message
const scheduleMessage = async (to, body, date) => {
  const job = schedule.scheduleJob(date, async () => {
    await sendMessage(to, body);
  });

  await addDoc(scheduledMessagesRef, { to, body, date, jobId: job.name });
  return job;
};

// Schedule a voice call (placeholder)
const scheduleVoiceCall = async (to, date) => {
  const job = schedule.scheduleJob(date, () => {
    console.log(`Calling ${to} at ${date}`);
    // Simulate a voice call request
  });
  await addDoc(scheduledMessagesRef, { to, date, jobId: job.name, type: 'voice' });
  return job;
};

// Get all scheduled messages
const getScheduledMessages = async () => {
  const querySnapshot = await getDocs(scheduledMessagesRef);
  return querySnapshot.docs.map(doc => doc.data());
};

// Cancel a scheduled message
const cancelScheduledMessage = async (jobId) => {
  const q = query(scheduledMessagesRef, where('jobId', '==', jobId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef);
    schedule.cancelJob(jobId);
  }
};

export { scheduleMessage, scheduleVoiceCall, getScheduledMessages, cancelScheduledMessage };