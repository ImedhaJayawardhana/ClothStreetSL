/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { fetchCart, saveCart } from "../api";

const CartContext = createContext();

const GUEST_CART_KEY = "clothstreet_cart";

function loadGuestCart() {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Track previous uid to detect login/logout transitions
  const prevUidRef = useRef(undefined);

  // ── Load cart when user changes ───────────────────────
  useEffect(() => {
    let cancelled = false;
    const prevUid = prevUidRef.current;
    prevUidRef.current = user?.uid ?? null;

    if (user?.uid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartLoaded(false);
      fetchCart()
        .then((res) => {
          if (!cancelled) {
            setCartItems(res.data.items || []);
            setCartLoaded(true);
          }
        })
        .catch(() => {
          // If API fails, start with empty cart
          if (!cancelled) {
            setCartItems([]);
            setCartLoaded(true);
          }
        });
    } else {
      // User logged out (or was never logged in)
      if (prevUid) {
        // Was logged in → now logged out: clear cart
        setCartItems([]);
        // Also clear any leftover localStorage keys
        localStorage.removeItem(GUEST_CART_KEY);
        // Remove user-specific keys too
        localStorage.removeItem(`clothstreet_cart_${prevUid}`);
      } else {
        // Initial load with no user → load guest cart
        setCartItems(loadGuestCart());
      }
      setCartLoaded(true);
    }

    return () => { cancelled = true; };
  }, [user?.uid]);

  // ── Sync helper: persist to Firestore or localStorage ──
  const syncCart = useCallback((items) => {
    if (user?.uid) {
      // Sync to Firestore (fire-and-forget)
      saveCart(items).catch(() => {
        // Silently fail — cart is still in memory
      });
    } else {
      saveGuestCart(items);
    }
  }, [user?.uid]);

  const addToCart = useCallback((item) => {
    // Block sellers from adding to cart
    if (user?.role === "seller") return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let next;
      if (existing) {
        next = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        next = [...prev, { ...item, quantity: item.quantity || 1, selected: true }];
      }
      syncCart(next);
      return next;
    });
  }, [user?.role, syncCart]);

  const toggleItemSelection = useCallback((id) => {
    setCartItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, selected: i.selected === false ? true : false } : i));
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const toggleAllSelection = useCallback((isSelected) => {
    setCartItems((prev) => {
      const next = prev.map((i) => ({ ...i, selected: isSelected }));
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const clearSelectedItems = useCallback(() => {
    setCartItems((prev) => {
      const next = prev.filter((i) => i.selected === false);
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        syncCart(next);
        return next;
      });
      return;
    }
    setCartItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
      syncCart(next);
      return next;
    });
  }, [syncCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    syncCart([]);
  }, [syncCart]);

  // Number of distinct product lines in the cart
  const cartProductCount = cartItems.length;
  // Total quantity across all products (metres)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const selectedCartItems = cartItems.filter((i) => i.selected !== false);
  const selectedCartProductCount = selectedCartItems.length;
  const selectedCartCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCartSubtotal = selectedCartItems.reduce(
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
        toggleItemSelection,
        toggleAllSelection,
        clearSelectedItems,
        selectedCartItems,
        selectedCartCount,
        selectedCartProductCount,
        selectedCartSubtotal,
        cartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
