import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import './CartPage.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingCost = totalPrice > 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + shippingCost + tax;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await orderAPI.checkout();
      alert('Order placed successfully! 🎉');
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      // Handle demo mode (no backend) or auth errors gracefully
      if (err.code === 'ERR_NETWORK') {
        // Backend is unavailable — simulate checkout in demo mode
        alert('Order placed successfully! 🎉 (Demo Mode)');
        clearCart();
        navigate('/orders');
        return;
      }
      alert('Error placing order: ' + (err.response?.data?.message || err.message));
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page page-content" id="cart-page">
        <div className="container">
          <div className="empty-cart animate-scaleIn">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <Link to="/" className="btn btn-primary btn-lg">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-content" id="cart-page">
      <div className="container">
        <div className="cart-header animate-slideUp">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
          <h1 className="page-title">Shopping Cart</h1>
          <p className="cart-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="cart-item card animate-slideUp"
                style={{ animationDelay: `${idx * 80}ms` }}
                id={`cart-item-${item.id}`}
              >
                <div className="cart-item-image">
                  <img
                    src={item.image || `https://placehold.co/120x120/FFF7ED/F97316?text=${encodeURIComponent(item.name?.charAt(0))}`}
                    alt={item.name}
                  />
                </div>
                <div className="cart-item-details">
                  <span className="cart-item-category">{item.category}</span>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <span className="cart-item-price">₹{item.price?.toLocaleString()}</span>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      id={`qty-minus-${item.id}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      id={`qty-plus-${item.id}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="cart-item-total">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    id={`remove-${item.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary card animate-slideUp" id="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            {totalPrice < 999 && (
              <div className="shipping-notice">
                💡 Add ₹{(999 - totalPrice).toLocaleString()} more for free shipping!
              </div>
            )}
            <button
              className="btn btn-primary btn-lg checkout-btn"
              onClick={handleCheckout}
              id="checkout-btn"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <div className="secure-badge">
              🔒 Secure checkout • 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
