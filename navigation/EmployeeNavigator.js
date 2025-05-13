import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Admin2 from "../screens/Admin2";
import EmployeeHomeScreen from "../screens/EmployeeHomeScreen";

const Tab = createBottomTabNavigator();

const EmployeeNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: true }}>
    <Tab.Screen 
      name="Inicio" 
      component={EmployeeHomeScreen} 
      options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
    />
    <Tab.Screen 
      name="V1" 
      component={Admin2} 
      options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} 
    />
  </Tab.Navigator>
);

export default EmployeeNavigator;