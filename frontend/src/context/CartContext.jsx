/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const BASE_CART_STORAGE_KEY = "clothstreet_cart";

function getCartStorageKey(userId) {
  return userId ? `${BASE_CART_STORAGE_KEY}_${userId}` : BASE_CART_STORAGE_KEY;
}

function loadCartFromStorage(userId) {
  try {
    const key = getCartStorageKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(userId, items) {
  try {
    const key = getCartStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Initialize with current user's cart (or guest cart)
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(user?.uid));

  // Switch cart when user logs in or out and merge guest cart if applicable
  useEffect(() => {
    let nextCart;

    if (user?.uid) {
      const guestCart = loadCartFromStorage(null);
      const userCart = loadCartFromStorage(user.uid);

      if (guestCart.length > 0) {
        // Merge guest cart into user cart
        const merged = [...userCart];
        guestCart.forEach((guestItem) => {
          const existing = merged.find((i) => i.id === guestItem.id);
          if (existing) {
            existing.quantity += guestItem.quantity || 1;
          } else {
            merged.push(guestItem);
          }
        });

        saveCartToStorage(user.uid, merged);
        // Clear the guest cart now that it's merged
        localStorage.removeItem(getCartStorageKey(null));
        nextCart = merged;
      } else {
        nextCart = userCart;
      }
    } else {
      nextCart = loadCartFromStorage(null);
    }

    setCartItems(nextCart);
  }, [user?.uid]);

  // Persist to localStorage whenever cartItems changes
  useEffect(() => {
    saveCartToStorage(user?.uid, cartItems);
  }, [cartItems, user?.uid]);

  const addToCart = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Number of distinct product lines in the cart
  const cartProductCount = cartItems.length;
  // Total quantity across all products (metres)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartProductCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
