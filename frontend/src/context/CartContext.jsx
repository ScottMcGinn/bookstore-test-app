import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((book, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === book.id);
      
      if (existingItem) {
        // Update quantity if book already in cart
        return prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Add new item to cart
      return [...prevItems, { ...book, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setCartItems((prevItems) =>
      prevItems.filter(item => item.id !== bookId)
    );
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prevItems) =>
        prevItems.filter(item => item.id !== bookId)
      );
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === bookId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
