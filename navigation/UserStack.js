import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Ordenar" component={SelectWaiter} options={{headerShown: false}} />
      <Stack.Screen name="Menu" component={Menu} options={{headerShown: false}} />
      <Stack.Screen name="Detalles" component={ProductDetailsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}