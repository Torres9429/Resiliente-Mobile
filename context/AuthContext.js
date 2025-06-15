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
      const rol = await AsyncStorage.getItem("rol");
      if (rol) {
        setUser(rol);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginApi({ email, password });
      const { datos } = response.data;
      console.log("datos: ", datos);
      if (datos && datos.token) {
        await saveToken(datos.token);
        const userData = {
          userId: datos.userId,
          email: datos.email,
          nombre: datos.nombre,
          apellido: datos.apellido,
          rol: datos.rol
        };
        await AsyncStorage.setItem("rol", JSON.stringify(datos.rol));  
        await AsyncStorage.setItem("userId", String(datos.userId));
        setUser(datos.rol);
        setError(null);
        console.log("user auth: ", user);

        // Navegar según el rol
        if (datos.rol === "ADMIN") {
          navigation.reset({
            index: 0,
            routes: [{ name: "AdminStack" }],
          });
        } else if (datos.rol === "EMPLEADO") {
          navigation.reset({
            index: 0,
            routes: [{ name: "EmployeeStack" }],
          });
        }
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Correo o contraseña incorrectos");
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("expiration");
      setUser(null);
      
    } catch (error) {
      console.error("Error en el cierre de sesión:", error);
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
