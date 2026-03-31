import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isAuthPath = config.url.endsWith('/login') || config.url.endsWith('/signup');
  
  if (token && !isAuthPath) {
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
