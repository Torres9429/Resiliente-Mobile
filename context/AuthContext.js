import { createContext, useState, useEffect } from "react";
import { login as loginApi } from "../api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { saveToken, getToken, removeToken } from "../api/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      const rolString = await AsyncStorage.getItem("rol");
      const token = await getToken();
      
      if (rolString && token) {
        try {
          const rol = JSON.parse(rolString);
          if (rol === "ADMIN" || rol === "EMPLEADO") {
            setUser(rol);
          } else {
            // Si el rol no es válido, limpia la sesión
            await logout();
          }
        } catch (e) {
          console.error("Error parsing role:", e);
          await logout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginApi({ email, password });
      const { datos } = response.data;
      console.log("datos: ", datos);
      
      if (datos && datos.token) {
        // Validar que el rol sea válido
        if (datos.rol !== "ADMIN" && datos.rol !== "EMPLEADO") {
          setError("Rol de usuario no válido");
          return;
        }

        await saveToken(datos.token);
        const userData = {
          userId: datos.userId,
          email: datos.email,
          nombre: datos.nombre,
          apellido: datos.apellido,
          rol: datos.rol
        };
        
        // Guardar el rol como string JSON
        await AsyncStorage.setItem("rol", JSON.stringify(datos.rol));
        setUser(datos);
        setError(null);
        console.log("user auth: ", user);
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Primero limpiamos el estado
      setUser(null);
      await removeToken();
      await AsyncStorage.removeItem("rol");
      
      // Usamos requestAnimationFrame para asegurar que el estado se actualice
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
/* import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const formattedUsername = username.toLowerCase().trim();

    if (formattedUsername === "admin" && password === "admin123") {
      setUser({ role: "admin" });
    } else if (formattedUsername === "user" && password === "user123") {
      setUser({ role: "empleado" });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; */
