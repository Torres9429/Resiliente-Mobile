import { createContext, useState, useEffect } from "react";
import { login as loginApi } from "../api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { saveToken, getToken, removeToken } from "../api/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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
        // Guardar solo el rol como string
        await AsyncStorage.setItem("rol", JSON.stringify(datos.rol));
        setUser(datos.rol);
        setUserData(datos);
        setError(null);
        console.log("user auth: ", datos.rol);
        console.log("user data: ", datos);
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
      setUser(null);
      setUserData(null);
      await removeToken();
      await AsyncStorage.removeItem("rol");
      
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
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, userData }}>
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
