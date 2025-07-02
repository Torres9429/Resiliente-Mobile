import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

// Función para decodificar JWT sin verificar la firma
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

// Función para verificar si el token ha expirado
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    // Convertir exp (timestamp en segundos) a milisegundos
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    
    // Agregar un margen de 5 minutos para renovar antes de que expire
    const margin = 5 * 60 * 1000; // 5 minutos en milisegundos
    
    return currentTime >= (expirationTime - margin);
  } catch (error) {
    console.error('Error verificando expiración del token:', error);
    return true;
  }
};

// Función para obtener información del token
export const getTokenInfo = (token) => {
  if (!token) return null;
  return decodeJWT(token);
};

// Función para obtener el tiempo restante del token en minutos
export const getTokenTimeRemaining = (token) => {
  if (!token) return 0;
  
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return 0;
    
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    
    return Math.max(0, Math.floor(timeRemaining / (1000 * 60))); // Retorna minutos
  } catch (error) {
    console.error('Error calculando tiempo restante del token:', error);
    return 0;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error guardando token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    
    // Verificar si el token ha expirado
    if (isTokenExpired(token)) {
      console.log('Token expirado, eliminando...');
      await removeToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error eliminando token:', error);
  }
};

// Función para limpiar toda la sesión
export const clearSession = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, 'rol']);
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error limpiando sesión:', error);
  }
};

// Función para verificar y limpiar sesión si es necesario
export const validateAndCleanSession = async () => {
  try {
    const token = await getToken();
    if (isTokenExpired(token)) {
      console.log('Token expirado durante validación, limpiando sesión...');
      await clearSession();
      return false; // Sesión inválida
    }
    return true; // Sesión válida
  } catch (error) {
    console.error('Error validando sesión:', error);
    await clearSession();
    return false;
  }
};