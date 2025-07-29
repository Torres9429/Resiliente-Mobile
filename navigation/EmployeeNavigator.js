import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useContext } from "react"
import { View, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

import { AuthContext } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

// Pantallas
import EmployeeHomeScreen from "../screens/EmployeeHomeScreen"
import AdminMenuScreen from "../screens/AdminMenuScreen"
import FormScreen from "../screens/FormScreen"
import ProductDetailsScreen from "../screens/ProductDetailsScreen"
import AdminProductDetailsScreen from "../screens/AdminProductDetailsScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack simplificado para empleados - solo pueden ver y agregar productos
const EmployeeMenuStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MenuList" component={AdminMenuScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="AdminProductDetails" component={AdminProductDetailsScreen} />
    <Stack.Screen name="AddProduct" component={FormScreen} initialParams={{ formType: "product", isEdit: false }} />
  </Stack.Navigator>
)

const TabIcon = ({ name, color, focused, theme }) => (
  <View style={[styles.iconContainer, focused && { backgroundColor: theme.primaryColor + "20" }]}>
    <MaterialCommunityIcons name={name} size={24} color={color} />
  </View>
)

const EmployeeNavigator = () => {
  const { logout } = useContext(AuthContext)
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          left: 20,
          right: 20,
          marginTop: 0,
          elevation: 0,
          backgroundColor: theme.cardBackground,
          height: 80,
          ...styles.shadow,
        },
        tabBarItemStyle: {
          marginTop: 5,
          marginBottom: 5,
        },
        tabBarActiveTintColor: theme.primaryColor,
        tabBarInactiveTintColor: theme.textTabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={EmployeeHomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={EmployeeMenuStack}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="food" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            logout()
          },
        }}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="logout" color={color} focused={focused} theme={theme} />,
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  iconContainer: {
    paddingVertical: 10,
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 10,
  },
})

export default EmployeeNavigator
