import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import EditProductScreen from '../screens/EditProductScreen';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator initialRouteName='Menu'>
      <Stack.Screen name="Menu" component={AdminMenuScreen} options={{headerShown: false}} />
      <Stack.Screen name="DetallesEdit" component={ProductDetailsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Editar" component={EditProductScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}