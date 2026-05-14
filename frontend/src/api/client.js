import axios from 'axios';
import { MOCK_MESSAGES } from '../data/mockData';

const API_BASE = 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export const getMessages = async () => {
  try {
    const response = await client.get('/messages?limit=20&offset=0');
    // If backend returns empty but success, still check if we should fallback
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return MOCK_MESSAGES;
  } catch (error) {
    console.warn('API fetch failed, falling back to mock data:', error.message);
    return MOCK_MESSAGES;
  }
};

export const getMessageById = async (id) => {
  try {
    const response = await client.get(`/messages/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`API fetch for message ${id} failed, falling back to mock:`, error.message);
    return MOCK_MESSAGES.find(m => m.id === id) || MOCK_MESSAGES[0];
  }
};

export const getHealth = async () => {
  try {
    const response = await client.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'offline' };
  }
};

export const sendToAI = async (payload) => {
  try {
    const response = await client.post('/webhook/message', payload);
    return response.data;
  } catch (error) {
    console.warn('AI Webhook failed, simulating response...');
    // Simulate a delay and a response
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      drafted_reply: `This is a simulated response to: "${payload.message_text}"`,
      confidence_score: 0.85,
      processing_time_ms: 150
    };
  }
};

export default client;
