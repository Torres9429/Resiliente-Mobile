import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import WelcomeScreen from "../screens/WelcomeScreen";
import AdminNavigator from "./AdminNavigator";
import UserNavigator from "./UserNavigator";
import LoginScreen from "../screens/LoginScreen";
import EmployeeNavigator from "./EmployeeNavigator";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          user.role === 'admin' ? (
            <Stack.Screen name="AdminStack" component={AdminNavigator} />
          ) : (
            <Stack.Screen name="EmployeeStack" component={EmployeeNavigator} />
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="UserHome" component={UserNavigator} />
          </>
        )}
        {/* user ? (
          <>
            <Stack.Screen name="Home" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="UserHome" component={UserNavigator} />
          </>
        ) : user.role === 'admin' ? (
          <Stack.Screen name="AdminStack" component={AdminNavigator} />
        ) : user.role === 'empleado'  (
          <Stack.Screen name="UserStack" component={UserNavigator} />
        ) */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
