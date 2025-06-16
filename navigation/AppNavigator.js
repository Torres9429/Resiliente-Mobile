import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import WelcomeScreen from "../screens/WelcomeScreen";
import AdminNavigator from "./AdminNavigator";
import UserNavigator from "./UserNavigator";
import LoginScreen from "../screens/LoginScreen";
import EmployeeNavigator from "./EmployeeNavigator";

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);
  console.log("user: ", user);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user === 'ADMIN' ? (
          <Stack.Screen name="AdminStack" component={AdminNavigator} />
        ) : user === 'EMPLEADO' ? (
          <Stack.Screen name="EmployeeStack" component={EmployeeNavigator} />
        ) : null
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="UserHome" component={UserNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
