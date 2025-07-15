/* import React, { useState, useContext, useEffect } from 'react';
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
} */
"use client"

import { GestureHandlerRootView } from "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { ThemeProvider } from "./context/ThemeContext"
import { UserHomeProvider } from "./context/UserHomeContext"
import MainNavigator from "./navigation/AppNavigator"

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <AuthProvider>
            <CartProvider>
              <UserHomeProvider>
                <MainNavigator />
              </UserHomeProvider>
            </CartProvider>
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
