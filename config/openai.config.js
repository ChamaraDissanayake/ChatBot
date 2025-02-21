import OpenAI from 'openai';
import { env } from './env.config.js'; // Import environment variables

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export default openai;