import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import UserHomeScreen from '../screens/UserHomeScreen';
import Admin2 from '../screens/Admin2';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ordenar" component={SelectWaiter} options={{headerShown: false}} />
      <Stack.Screen name="Menu" component={Menu} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}