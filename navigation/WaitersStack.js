import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWaiterScreen from '../screens/AddWaiterScreen';
import EditWaiterScreen from '../screens/EditWaiterScreen';
import AdminEmployeesScreen from '../screens/AdminEmployeesScreen';

const Stack = createNativeStackNavigator();

export default function WaitersStack() {
  return (
    <Stack.Navigator initialRouteName='WaiterScreen'>
      <Stack.Screen name="WaiterScreen" component={AdminEmployeesScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddWaiter" component={AddWaiterScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditWaiter" component={EditWaiterScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}