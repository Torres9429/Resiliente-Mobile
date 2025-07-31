import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { View, StyleSheet, Platform, Animated, Pressable,} from "react-native"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"

import { useTheme } from "../context/ThemeContext"

// Pantallas
import UserHomeScreen from "../screens/UserHomeScreen"
import SelectWaiter from "../screens/SelectWaiter"
import Menu from "../screens/Menu"
import ProductDetailsScreen from "../screens/ProductDetailsScreen"
import CartScreen from "../screens/CartScreen"
import LearnScreen from "../screens/LearnScreen"
import { useRef } from "react"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack para el flujo de pedidos
const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SelectWaiter" component={SelectWaiter} />
    <Stack.Screen name="Menu" component={Menu} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
)

const TabIcon = ({ name, color, focused, theme }) => (
  <View style={[styles.iconContainer, focused && { backgroundColor: theme.primaryColor + "20" }]}>
    {name === "game-controller" ? (
      <Ionicons name="game-controller" size={24} color={color} />
    ) : (
      <MaterialCommunityIcons name={name} size={24} color={color} />
    )}
  </View>
)

const UserNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          backgroundColor: theme.cardBackground,
          height: Platform.OS === "ios" ? 80 : 95,
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
        component={UserHomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderStack}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="food" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="cart" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="game-controller" color={color} focused={focused} theme={theme} />
          ),
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

export default UserNavigator
