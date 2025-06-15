import axios from 'axios';
import { API_BASE_URL } from '@env';
import { getToken } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
 

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
      // Manejar error de autenticación
      console.error('Error de autenticación:', error);
    }
    return Promise.reject(error);
  }
); 

export default api;