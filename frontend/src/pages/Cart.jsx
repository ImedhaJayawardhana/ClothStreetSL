import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartProductCount,
    cartSubtotal,
  } = useCart();

  const SHIPPING_COST = 500;
  const FREE_SHIPPING_THRESHOLD = 50000;
  const shipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartSubtotal + shipping;

  /* ── Empty state ── */
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <div className="cart-header-inner">
            <div>
              <h1 className="cart-header-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                Shopping Cart
              </h1>
              <span className="cart-header-count">0 items in your cart</span>
            </div>
          </div>
        </div>

        <div className="cart-body">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven&apos;t added any fabrics yet. Browse our marketplace to find premium materials.</p>
            <Link to="/shop" className="cart-empty-cta">
              Start Shopping
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Cart with items ── */
  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-header-inner">
          <div>
            <h1 className="cart-header-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Shopping Cart
            </h1>
            <span className="cart-header-count">
              {cartProductCount} {cartProductCount === 1 ? "item" : "items"} in your cart
            </span>
          </div>

          <button className="cart-clear-btn" onClick={clearCart}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="cart-body">
        {/* Left — Cart Items */}
        <div className="cart-items-section">
          {cartItems.map((item) => (
            <div className="cart-item-card" key={item.id}>
              {/* Product Image */}
              {item.image ? (
                <img src={item.image} alt={item.name} className="cart-item-img" />
              ) : (
                <div className="cart-item-img-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
              )}

              {/* Item Info */}
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-meta">
                  {item.supplier}{item.category ? ` · ${item.category}` : ""}
                </p>

                {/* Quantity controls */}
                <div className="cart-item-qty">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    className="cart-item-qty-val"
                    value={item.quantity}
                    readOnly
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <span className="cart-item-unit">metres</span>
                </div>
              </div>

              {/* Price */}
              <div className="cart-item-price">
                <p className="cart-item-total">
                  LKR {((item.unitPrice ?? 0) * item.quantity).toLocaleString()}
                </p>
                <p className="cart-item-unit-price">
                  LKR {(item.unitPrice ?? 0).toLocaleString()} / metre
                </p>
              </div>

              {/* Delete */}
              <button
                className="cart-item-delete"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}

          <Link to="/shop" className="cart-continue-link">
            ← Continue Shopping
          </Link>
        </div>

        {/* Right — Sidebar */}
        <div className="cart-sidebar">
          {/* Promo Code */}
          <div className="cart-promo-card">
            <h3 className="cart-promo-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 9 3-3 3 3" /><path d="M13 18H7a2 2 0 0 1-2-2V6" /><path d="m22 15-3 3-3-3" /><path d="M11 6h6a2 2 0 0 1 2 2v10" />
              </svg>
              Promo Code
            </h3>
            <div className="cart-promo-row">
              <input
                type="text"
                className="cart-promo-input"
                placeholder="e.g. CLOTH10"
              />
              <button className="cart-promo-btn">Apply</button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>LKR {cartSubtotal.toLocaleString()}</span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `LKR ${shipping.toLocaleString()}`}</span>
            </div>

            <p className="cart-summary-note">
              Free shipping on orders over LKR {FREE_SHIPPING_THRESHOLD.toLocaleString()}
            </p>

            <hr className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>

            <Link to="/checkout" className="cart-checkout-btn">
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <p className="cart-secure-note">
              🔒 Secure checkout · COD &amp; Bank Transfer available
            </p>
          </div>

          {/* Trust Badges */}
          <div className="cart-trust-card">
            <div className="cart-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              100% verified suppliers
            </div>
            <div className="cart-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Quality guarantee on all fabrics
            </div>
            <div className="cart-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Free returns within 7 days
            </div>
            <div className="cart-trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Island-wide delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
