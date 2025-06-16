import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectWaiter from '../screens/SelectWaiter';
import Menu from '../screens/Menu';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import MenuStack from './MenuStack';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import AddWaiterScreen from '../screens/AddWaiterScreen';
import AdminEmployeesScreen from '../screens/AdminEmployeesScreen';
import EditWaiterScreen from '../screens/EditWaiterScreen';
import EmployeeHomeScreen from '../screens/EmployeeHomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';

const Stack = createNativeStackNavigator();

export default function EmployeesStack() {
  return (
    <Stack.Navigator initialRouteName='EmployeeScreen'>
      <Stack.Screen name="EmployeeScreen" component={EmployeeHomeScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}