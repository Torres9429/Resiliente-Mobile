import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Admin2 from "../screens/Admin2";
import EmployeeHomeScreen from "../screens/EmployeeHomeScreen";

const Tab = createBottomTabNavigator();

const EmployeeNavigator = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen 
        name="Inicio" 
        component={EmployeeHomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="V1" 
        component={Admin2} 
        options={{ tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} /> }} 
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

export default EmployeeNavigator;