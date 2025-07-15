/* import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserHomeScreen from "../screens/UserHomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserStack from "./UserStack";
import CartScreen from "../screens/CartScreen";
import LearnScreen from "../screens/LearnScreen";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const UserNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        //position: 'absolute',
          //bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: theme.cardBackground,
          //borderRadius: 15,
          height: 80,
          ...styles.shadow
      },
      tabBarItemStyle: {
        marginTop: 5,
        marginBottom: 5,
      },
      tabBarActiveTintColor: theme.primaryColor,
      tabBarInactiveTintColor: theme.textTabBar,
      tabBarShowLabel: false,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      }
    }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={UserHomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: theme.primaryColor + '20' }
            ]}>
              <MaterialCommunityIcons 
                name="home" 
                size={24} 
                color={color} 
              />
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Ordenar" 
        component={UserStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: theme.primaryColor + '20' }
            ]}>
              <MaterialCommunityIcons 
                name="food" 
                size={24} 
                color={color} 
              />
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CartScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: theme.primaryColor + '20' }
            ]}>
              <MaterialCommunityIcons 
                name="cart" 
                size={24} 
                color={color} 
              />
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearnScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: theme.primaryColor + '20' }
            ]}>
              <MaterialCommunityIcons 
                name="hand-clap" 
                size={24} 
                color={color} 
              />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  iconContainer: {
    //padding: 10,
    paddingVertical: 10,
    //paddingBottom: 15,
    borderRadius: "50%",
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  }
});

export default UserNavigator; */
"use client"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { View, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

import { useTheme } from "../context/ThemeContext"

// Pantallas
import UserHomeScreen from "../screens/UserHomeScreen"
import SelectWaiter from "../screens/SelectWaiter"
import Menu from "../screens/Menu"
import ProductDetailsScreen from "../screens/ProductDetailsScreen"
import CartScreen from "../screens/CartScreen"
import LearnScreen from "../screens/LearnScreen"

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
    <MaterialCommunityIcons name={name} size={24} color={color} />
  </View>
)

const UserNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          left: 20,
          right: 20,
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
            <TabIcon name="hand-clap" color={color} focused={focused} theme={theme} />
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
