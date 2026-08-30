import axios from 'axios';

const defaultApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  return `${window.location.protocol}//${window.location.hostname}:3000`;
};

const configuredApiUrl = import.meta.env.VITE_API_URL || defaultApiUrl();
// VITE_API_URL is the API origin, not its versioned path. Normalizing here
// prevents an accidental /api/v1/api/v1 URL when a deploy variable includes it.
export const API_URL = configuredApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
const CLIENT_INSTANCE_STORAGE_KEY = 'client-instance-id';

export const getClientInstanceId = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  let clientInstanceId = window.sessionStorage.getItem(CLIENT_INSTANCE_STORAGE_KEY);
  if (clientInstanceId) {
    return clientInstanceId;
  }

  clientInstanceId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(CLIENT_INSTANCE_STORAGE_KEY, clientInstanceId);
  return clientInstanceId;
};

export const getErrorMessage = (error) => {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.';
    }
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }
    return 'Error de conexión. Por favor verifica tu conexión e intenta de nuevo.';
  }

  const data = error.response?.data;
  if (data?.error) {
    return data.error;
  }
  if (data?.message) {
    return data.message;
  }

  switch (error.response?.status) {
    case 400:
      return 'Solicitud inválida. Por favor verifica los datos ingresados.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 422:
      return data?.errors ? Object.values(data.errors).flat().join(', ') : 'Datos inválidos.';
    case 500:
      return 'Error del servidor. Por favor intenta más tarde.';
    default:
      return 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
  }
};

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  config.headers['X-Client-Instance-Id'] = getClientInstanceId();
  return config;
});

export default api;
