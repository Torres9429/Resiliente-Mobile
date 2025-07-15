"use client"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { View, ActivityIndicator } from "react-native"

// Navegadores principales
import AdminNavigator from "./AdminNavigator"
import EmployeeNavigator from "./EmployeeNavigator"
import UserNavigator from "./UserNavigator"

// Pantallas de autenticación
import WelcomeScreen from "../screens/WelcomeScreen"
import LoginScreen from "../screens/LoginScreen"

const Stack = createNativeStackNavigator()

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#BACA16" />
  </View>
)

const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Usuario autenticado - mostrar navegador según rol
        user === "ADMIN" ? (
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
        ) : user === "EMPLEADO" ? (
          <Stack.Screen name="EmployeeApp" component={EmployeeNavigator} />
        ) : null
      ) : (
        // Usuario no autenticado - mostrar flujo de autenticación y usuario público
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="UserApp" component={UserNavigator} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator
