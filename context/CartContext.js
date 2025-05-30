import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert('Producto agregado al carrito');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(product => product.id !== productId));
    alert('Producto eliminado del carrito');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};