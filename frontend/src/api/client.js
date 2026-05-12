import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const messagesApi = {
  getMessages: async (params = { limit: 20, offset: 0 }) => {
    const { data } = await api.get('/messages', { params });
    return data;
  },
  getMessageDetail: async (id) => {
    const { data } = await api.get(`/messages/${id}`);
    return data;
  },
};

export const guestsApi = {
  getGuest: async (id) => {
    const { data } = await api.get(`/guests/${id}`);
    return data;
  },
};

export const healthApi = {
  checkHealth: async () => {
    const { data } = await api.get('/health');
    return data;
  },
};

export default api;
