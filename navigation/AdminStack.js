import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import MenuStack from './MenuStack';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import AddWaiterScreen from '../screens/AddWaiterScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ordenar" component={SelectWaiter} options={{headerShown: false}} />
      <Stack.Screen name="Menu" component={AdminMenuScreen} options={{headerShown: false}} />
      <Stack.Screen name="Detalles" component={ProductDetailsScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddWaiter" component={AddWaiterScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}