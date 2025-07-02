import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AddProductScreen from '../screens/AddProductScreen';

import AdminSignScreen from '../screens/AdminSignsScreen';
import SignFormScreen from '../screens/AddSignScreen';

const Stack = createNativeStackNavigator();

export default function SignStack() {
  return (
    <Stack.Navigator initialRouteName='Sign'>
      <Stack.Screen name="Sign" component={AdminSignScreen} options={{headerShown: false}} />
      <Stack.Screen name="DetallesSign" component={ProductDetailsScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddSign" component={SignFormScreen} options={{headerShown: false}} />
      <Stack.Screen name="SignForm" component={SignFormScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}