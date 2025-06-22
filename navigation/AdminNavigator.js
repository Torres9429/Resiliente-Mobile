import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

import MenuStack from "./MenuStack";
import SignStack from "./SignStack";
import WaitersStack from "./WaitersStack";
import { AuthContext } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
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

export default AdminNavigator;