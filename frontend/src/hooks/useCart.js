import { useState, useCallback } from 'react';

const useCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    setCart
  };
};

export default useCart;