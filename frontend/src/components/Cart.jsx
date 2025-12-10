import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart({ onClose, onCheckout }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    onClose();
    onCheckout();
  };

  const handleQuantityChange = (bookId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(bookId, quantity);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Shopping Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p className="empty-cart-icon">📭</p>
              <p>Your cart is empty</p>
              <p className="empty-cart-hint">Add books to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} />
                      ) : (
                        <div className="cart-item-placeholder">📖</div>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <h3>{item.title}</h3>
                      <p className="cart-item-author">{item.author}</p>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="cart-item-quantity">
                      <label htmlFor={`qty-${item.id}`}>Qty:</label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="quantity-input"
                      />
                    </div>

                    <div className="cart-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from cart"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span className="summary-value">{getTotalItems()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Price:</span>
                  <span className="summary-value">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="cart-footer">
          {cartItems.length > 0 && (
            <>
              <button
                className="btn-clear-cart"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="btn-checkout"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </>
          )}
          <button
            className="btn-continue-shopping"
            onClick={onClose}
          >
            {cartItems.length === 0 ? 'Close' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
