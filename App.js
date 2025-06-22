import React, { useState, useContext, useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import MainNavigator from "./navigation/AppNavigator";
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      <NavigationContainer>
        <AuthProvider>
          <CartProvider>
            <MainNavigator />
          </CartProvider>
        </AuthProvider>
      </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}