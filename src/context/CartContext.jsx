import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Options: { weight, unit, price } for weight-sold products (gram/carat).
  // Falls back to product.price for fixed-price items (e.g. future jewelry).
  const addToCart = useCallback((product, options = {}) => {
    setItems(currentItems => {
      const lineKey = options.weight ? `${product.id}-${options.weight}${options.unit}` : `${product.id}`;
      const existingItem = currentItems.find(item => item.lineKey === lineKey);
      if (existingItem) {
        return currentItems.map(item =>
          item.lineKey === lineKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, {
        ...product,
        lineKey,
        weight: options.weight || null,
        unit: options.unit || null,
        price: options.price || product.price || 0,
        quantity: 1,
      }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((lineKey) => {
    setItems(currentItems => currentItems.filter(item => item.lineKey !== lineKey));
  }, []);

  const updateQuantity = useCallback((lineKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(lineKey);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.lineKey === lineKey ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
