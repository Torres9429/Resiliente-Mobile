import React, { useState, useContext, useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import MainNavigator from "./navigation/AppNavigator";
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <CartProvider>
        <MainNavigator />
        </CartProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}