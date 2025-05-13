import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import { Feather } from "@expo/vector-icons";
import Admin2 from "../screens/Admin2";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: true }}>
    <Tab.Screen 
      name="Inicio" 
      component={AdminHomeScreen} 
      options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="V1" 
      component={Admin2} 
      options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
    />
  </Tab.Navigator>
);

export default AdminNavigator;