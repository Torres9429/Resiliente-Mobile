import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployeeHomeScreen from '../screens/EmployeeHomeScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import MenuStack from './MenuStack';

const Stack = createNativeStackNavigator();

export default function EmployeesStack() {
  return (
    <Stack.Navigator initialRouteName='EmployeeScreen'>
      <Stack.Screen name="EmployeeScreen" component={EmployeeHomeScreen} options={{headerShown: false}} />
      <Stack.Screen name="Menu" component={MenuStack} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}