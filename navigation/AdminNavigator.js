/* import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

import MenuStack from "./MenuStack";
import SignStack from "./SignStack";
import WaitersStack from "./WaitersStack";
import { AuthContext } from "../context/AuthContext";
import AdminLearnScreen from "../screens/AdminLearnScreen";
import LearnStack from "./LearnStack";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  const { logout } = useContext(AuthContext);
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
          marginTop: 0,
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
        component={AdminHomeScreen} 
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
        name="Menú" 
        component={MenuStack} 
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
        name="Meseros" 
        component={WaitersStack} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: theme.primaryColor + '20' }
            ]}>
              <MaterialCommunityIcons 
                name="account-group" 
                size={24} 
                color={color} 
              />
            </View>
          )
        }}
      />
      <Tab.Screen 
        name="Señas" 
        component={SignStack} 
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
      <Tab.Screen
        name="Juegos"
        component={LearnStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: theme.primaryColor + '20' }
            ]}>
              {/* <MaterialCommunityIcons 
                name="nintendo-game-boy" 
                size={24} 
                color={color} 
              /> }
              <Ionicons
                name="game-controller" 
                size={24} 
                color={color} 
              />
            </View>
          ),
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

export default AdminNavigator; */

"use client"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useContext } from "react"
import { View, StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

import { AuthContext } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

// Pantallas principales
import AdminHomeScreen from "../screens/AdminHomeScreen"
import AdminMenuScreen from "../screens/AdminMenuScreen"
import AdminEmployeesScreen from "../screens/AdminEmployeesScreen"
import AdminSignsScreen from "../screens/AdminSignsScreen"
import AdminLearnScreen from "../screens/AdminLearnScreen"

// Pantallas compartidas
import FormScreen from "../screens/FormScreen"
import ProductDetailsScreen from "../screens/ProductDetailsScreen"
import UserHomeScreen from "../screens/UserHomeScreen"
import EditUserHomeScreen from "../screens/EditUserHomeScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack para el menú con sus pantallas relacionadas
const MenuStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MenuList" component={AdminMenuScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <Stack.Screen name="AddProduct" component={FormScreen} initialParams={{ formType: "product", isEdit: false }} />
    <Stack.Screen name="EditProduct" component={FormScreen} initialParams={{ formType: "product", isEdit: true }} />
  </Stack.Navigator>
)

// Stack para empleados
const EmployeesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EmployeesList" component={AdminEmployeesScreen} />
    <Stack.Screen name="AddEmployee" component={FormScreen} initialParams={{ formType: "waiter", isEdit: false }} />
    <Stack.Screen name="EditEmployee" component={FormScreen} initialParams={{ formType: "waiter", isEdit: true }} />
  </Stack.Navigator>
)

// Stack para señas
const SignsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignsList" component={AdminSignsScreen} />
    <Stack.Screen name="AddSign" component={FormScreen} initialParams={{ formType: "sign", isEdit: false }} />
    <Stack.Screen name="EditSign" component={FormScreen} initialParams={{ formType: "sign", isEdit: true }} />
  </Stack.Navigator>
)

// Stack para juegos
const GamesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GamesList" component={AdminLearnScreen} />
    <Stack.Screen name="AddGame" component={FormScreen} initialParams={{ formType: "game", isEdit: false }} />
    <Stack.Screen name="EditGame" component={FormScreen} initialParams={{ formType: "game", isEdit: true }} />
  </Stack.Navigator>
)

// Stack para pantalla de usuario 
const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserHome" component={UserHomeScreen} />
    <Stack.Screen name="EditUserHome" component={EditUserHomeScreen} />
  </Stack.Navigator>
)

const TabIcon = ({ name, color, focused, theme, isIonicon = false }) => {
  const IconComponent = isIonicon ? Ionicons : MaterialCommunityIcons
  return (
    <View style={[styles.iconContainer, focused && { backgroundColor: theme.primaryColor + "20" }]}>
      <IconComponent name={name} size={24} color={color} />
    </View>
  )
}

const AdminNavigator = () => {
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
        component={AdminHomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuStack}
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon name="food" color={color} focused={focused} theme={theme} />,
        }}
      />
      <Tab.Screen
        name="Employees"
        component={EmployeesStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="account-group" color={color} focused={focused} theme={theme} />
          ),
        }}
      />
      <Tab.Screen
        name="Signs"
        component={SignsStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="hand-clap" color={color} focused={focused} theme={theme} />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="game-controller" color={color} focused={focused} theme={theme} isIonicon />
          ),
        }}
      />
      <Tab.Screen
        name="UserInterface"
        component={UserStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="monitor-dashboard" color={color} focused={focused} theme={theme} />
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

export default AdminNavigator
