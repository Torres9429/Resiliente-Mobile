import axios from 'axios';
import { API_BASE_URL } from '@env';
import { getToken, clearSession } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Event emitter simple para React Native
class TokenExpiredEmitter {
  constructor() {
    this.listeners = [];
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  emit() {
    this.listeners.forEach(callback => callback());
  }
}

export const tokenExpiredEmitter = new TokenExpiredEmitter();

const api = axios.create({
  baseURL: API_BASE_URL,
   headers: {
    "Content-Type": "application/json"
  }, 
});
console.log('API Base URL:', API_BASE_URL);
export const apiMultipart = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  transformRequest: (data) => data,
});


api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log('Token obtenido:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Verificar si es un error de credenciales inválidas o token expirado
      const errorMessage = error.response?.data?.mensaje || '';
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      // Solo limpiar sesión si NO es una petición de login con credenciales inválidas
      if (!isLoginRequest || !errorMessage.includes('Credenciales inválidas')) {
        console.error('Error de autenticación (401) - Token expirado:', error.response?.data);
        
        // Limpiar sesión automáticamente
        await clearSession();
        
        // Emitir evento para que la app maneje el logout
        tokenExpiredEmitter.emit();
        
        console.log('Sesión limpiada automáticamente debido a token expirado');
      }
    }
    return Promise.reject(error);
  }
);

// Aplicar los mismos interceptores a apiMultipart
apiMultipart.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiMultipart.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.mensaje || '';
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginRequest || !errorMessage.includes('Credenciales inválidas')) {
        console.error('Error de autenticación (401) en apiMultipart - Token expirado:', error.response?.data);
        await clearSession();
        tokenExpiredEmitter.emit();
      }
    }
    return Promise.reject(error);
  }
);

export default api;