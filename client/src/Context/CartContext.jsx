import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add variant to cart
  const addToCart = (variant) => {
    setCart((prev) => {
      const variantId = variant.variantId || variant.id;
      const existing = prev.find((item) => item.variantId === variantId);

      if (existing) {
        // Increment quantity if already in cart
        return prev.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + (variant.quantity || 1) }
            : item
        );
      }

      // Otherwise, add new item
      return [
        ...prev,
        { ...variant, variantId, quantity: variant.quantity || 1 },
      ];
    });
  };

  // Update quantity of a variant (remove if quantity <= 0)
  const updateQuantity = (variantId, newQuantity) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (variantId) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => setCart([]);

  // Total number of items in cart
  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);