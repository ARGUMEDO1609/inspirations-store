import { createConsumer } from '@rails/actioncable';

const cableUrl = import.meta.env.VITE_CABLE_URL || 'ws://127.0.0.1:3000/cable';
let cachedConsumer = null;

export const getCableConsumer = () => {
  if (cachedConsumer) {
    return cachedConsumer;
  }

  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return null;
  }

  const token = storedToken.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return null;
  }

  cachedConsumer = createConsumer(`${cableUrl}?token=${token}`);
  return cachedConsumer;
};

export const resetCableConsumer = () => {
  if (cachedConsumer) {
    cachedConsumer.disconnect();
    cachedConsumer = null;
  }
};
