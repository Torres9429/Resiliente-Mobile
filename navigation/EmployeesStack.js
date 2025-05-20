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

const Stack = createNativeStackNavigator();

export default function EmployeesStack() {
  return (
    <Stack.Navigator initialRouteName='Waiter'>
      <Stack.Screen name="Waiter" component={AdminEmployeesScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddWaiter" component={AddWaiterScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditWaiter" component={EditWaiterScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}