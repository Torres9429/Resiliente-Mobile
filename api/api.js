import axios from 'axios';
import { API_BASE_URL} from '@env';
/* import { getToken } from '../api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
},
});
console.log('API Base URL:', API_BASE_URL);


/* 
api.interceptors.request.use(
  async (config) => {
    //const token = await getToken();
    const token = await AsyncStorage.getItem("jwt"); // Cambia esto por el nombre correcto de tu token
    console.log("Token obtenido:", token); // Muestra el token obtenido
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
  (response) => {
    //console.log("Respuesta de la API:", response);
    return response;
  },
  (error) => {
    //console.error("Error en la respuesta de la API:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
); */

export default api;