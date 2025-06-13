import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AddProductScreen from '../screens/AddProductScreen';
import AddSignScreen from '../screens/AddSignScreen';
import AdminSignScreen from '../screens/AdminSignsScreen';

const Stack = createNativeStackNavigator();

export default function SignStack() {
  return (
    <Stack.Navigator initialRouteName='Sign'>
      <Stack.Screen name="Sign" component={AdminSignScreen} options={{headerShown: false}} />
      <Stack.Screen name="DetallesSign" component={ProductDetailsScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddSign" component={AddSignScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditarSign" component={EditProductScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}