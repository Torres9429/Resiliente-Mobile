import { createContext, useState, useEffect, useRef } from "react";
import { login as loginApi } from "../api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { saveToken, getToken, removeToken, clearSession, isTokenExpired, getTokenInfo, validateAndCleanSession } from "../api/authService";
import { tokenExpiredEmitter } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const validationIntervalRef = useRef(null);

  useEffect(() => {
    checkUser();
    
    // Escuchar eventos de token expirado
    const unsubscribe = tokenExpiredEmitter.addListener(() => {
      console.log('Evento de token expirado recibido');
      handleLogout();
    });

    // Configurar validación periódica del token (cada 5 minutos)
    validationIntervalRef.current = setInterval(async () => {
      if (user) {
        const isValid = await validateAndCleanSession();
        if (!isValid) {
          console.log('Sesión invalidada durante validación periódica');
          handleLogout();
        }
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      unsubscribe();
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
      }
    };
  }, [user]);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      const rolString = await AsyncStorage.getItem("rol");
      const token = await getToken();
      
      console.log('Verificando sesión - Token:', token ? 'Presente' : 'Ausente', 'Rol:', rolString);
      
      if (rolString && token) {
        try {
          const rol = JSON.parse(rolString);
          
          // Verificar que el token no haya expirado
          if (isTokenExpired(token)) {
            console.log('Token expirado durante verificación inicial');
            await handleLogout();
            return;
          }
          
          // Verificar que el rol en el token coincida con el almacenado
          const tokenInfo = getTokenInfo(token);
          if (tokenInfo && tokenInfo.rol && tokenInfo.rol !== rol) {
            console.log('Rol en token no coincide con el almacenado');
            await handleLogout();
            return;
          }
          
          if (rol === "ADMIN" || rol === "EMPLEADO") {
            setUser(rol);
            console.log('Sesión válida restaurada para:', rol);
          } else {
            console.log('Rol inválido:', rol);
            await handleLogout();
          }
        } catch (e) {
          console.error("Error parsing role:", e);
          await handleLogout();
        }
      } else {
        console.log('No hay sesión válida');
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      await handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const response = await loginApi({ email, password });
      const { datos } = response.data;
      console.log("datos: ", datos);
      
      if (datos && datos.token) {
        // Validar que el rol sea válido
        if (datos.rol !== "ADMIN" && datos.rol !== "EMPLEADO") {
          throw new Error("Rol de usuario no válido");
        }

        // Verificar que el token no esté expirado antes de guardarlo
        if (isTokenExpired(datos.token)) {
          throw new Error("Token recibido ya está expirado");
        }

        await saveToken(datos.token);
        // Guardar solo el rol como string
        await AsyncStorage.setItem("rol", JSON.stringify(datos.rol));
        setUser(datos.rol);
        setUserData(datos);
        console.log("user auth: ", datos.rol);
        console.log("user data: ", datos);
        
        return { success: true, data: datos };
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión auth:", error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      setUserData(null);
      await clearSession();
      
      // Limpiar el intervalo de validación
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
        validationIntervalRef.current = null;
      }
      
      requestAnimationFrame(() => {
        if (navigation) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          });
        }
      });
    } catch (error) {
      console.error("Error en el cierre de sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await handleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
