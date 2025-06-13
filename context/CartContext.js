import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, cantidad: (item.cantidad || 1) + (product.cantidad || 1) }
            : item
        );
      } else {
        return [...prevCart, { ...product, cantidad: product.cantidad || 1 }];
      }
    });
    //alert('Producto agregado al carrito');
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