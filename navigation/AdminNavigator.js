import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminMenuScreen from "../screens/AdminMenuScreen";
import AdminSignsScreen from "../screens/AdminSignsScreen";
import AdminEmployeesScreen from "../screens/AdminEmployeesScreen";
import MenuStack from "./MenuStack";
import EmployeesStack from "./EmployeesStack";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  const { logout } = useContext(AuthContext);
  return (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen 
      name="Inicio" 
      component={AdminHomeScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="Menú" 
      component={MenuStack} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cupcake" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="Empleados" 
      component={EmployeesStack} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="Señas" 
      component={AdminSignsScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hand-clap" size={24} color={color} /> }} 
    />
    <Tab.Screen 
        name="Salir" 
        component={() => null} // No necesita un componente visual
        listeners={{
          tabPress: () => logout(), // Llama a logout al presionar "Salir"
        }}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="logout" size={24} color={color} /> }}
      />
  </Tab.Navigator>
  );
};

export default AdminNavigator;