import { createConsumer } from '@rails/actioncable';
import api from './axios';

const cableUrl = import.meta.env.VITE_CABLE_URL || 'ws://127.0.0.1:3000/cable';
let cachedConsumer = null;

// Fetch a short-lived token from POST /cable_token (the session cookie is sent
// automatically because axios has withCredentials:true). The token is then
// passed to ActionCable via the Sec-WebSocket-Protocol subprotocol because the
// browser cannot set custom headers on a WebSocket upgrade and does not send
// cookies cross-origin. Token TTL is 60s (see CableTokensController).
let pendingToken = null;

const fetchWsToken = async () => {
  const response = await api.post('/cable_token', {});
  return response.data?.data?.token || response.data?.token;
};

export const getCableConsumer = async () => {
  if (cachedConsumer) {
    return cachedConsumer;
  }

  let token;
  try {
    if (!pendingToken) {
      pendingToken = fetchWsToken();
    }
    token = await pendingToken;
    pendingToken = null;
  } catch {
    pendingToken = null;
    return null;
  }

  if (!token) {
    return null;
  }

  cachedConsumer = createConsumer(cableUrl, ['actioncable-v1-json', `Bearer.${token}`]);
  return cachedConsumer;
};

export const resetCableConsumer = () => {
  if (cachedConsumer) {
    cachedConsumer.disconnect();
    cachedConsumer = null;
  }
  pendingToken = null;
};
