import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EmployeeHomeScreen from "../screens/EmployeeHomeScreen";
import AddProductScreen from "../screens/AddProductScreen";
import EmployeesStack from "./EmployeesStack";

const Tab = createBottomTabNavigator();

const EmployeeNavigator = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen 
        name="Inicio" 
        component={EmployeesStack} 
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Menu" 
        component={AddProductScreen} 
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food" size={24} color={color} /> }} 
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