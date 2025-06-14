import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserHomeScreen from "../screens/UserHomeScreen";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import UserStack from "./UserStack";
import SelectWaiter from "../screens/SelectWaiter";
import CartScreen from "../screens/CartScreen";
import LearnScreen from "../screens/LearnScreen";

const Tab = createBottomTabNavigator();

const UserNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen 
      name="Inicio" 
      component={UserHomeScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="Ordenar" 
      component={UserStack} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="Carrito" 
      component={CartScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cart" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="Learn" 
      component={LearnScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hand-clap" size={24} color={color} /> }} 
    />
  </Tab.Navigator>
);

export default UserNavigator;