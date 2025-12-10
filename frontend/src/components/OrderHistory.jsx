import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getOrderHistory(user.id);
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="order-history">
        <div className="loading" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Loading your order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history">
        <div className="error-message" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="order-history">
        <div className="empty-state">
          <p>📦</p>
          <p>No orders yet</p>
          <p className="hint">Your completed purchases will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`order-card ${expandedOrderId === order.id ? 'expanded' : ''}`}
          >
            <div
              className="order-summary"
              role="button"
              tabIndex={0}
              onClick={() => toggleOrderDetails(order.id)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleOrderDetails(order.id);
                }
              }}
              aria-expanded={expandedOrderId === order.id}
              aria-controls={`order-details-${order.id}`}
            >
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-date">{formatDate(order.date)}</div>
                </div>
                <div className="order-total">
                  <span className="label">Total:</span>
                  <span className="amount">{formatCurrency(order.total)}</span>
                </div>
                <div
                  className={`order-status status-${(order.status || 'completed').toLowerCase()}`}
                  role="status"
                >
                  {order.status || 'Completed'}
                </div>
              </div>

              <div className="order-items-preview">
                {order.items && order.items.slice(0, 2).map((item, index) => (
                  <span key={index} className="item-tag">
                    {item.title}
                  </span>
                ))}
                {order.items && order.items.length > 2 && (
                  <span className="item-tag more">
                    +{order.items.length - 2} more
                  </span>
                )}
              </div>

              <button
                className="toggle-btn"
                aria-label={expandedOrderId === order.id ? 'Collapse order details' : 'Expand order details'}
              >
                {expandedOrderId === order.id ? '▲' : '▼'}
              </button>
            </div>

            {expandedOrderId === order.id && (
              <div id={`order-details-${order.id}`} className="order-details">
                <div className="details-section">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="item-detail">
                          <div className="item-name">
                            <div className="title">{item.title}</div>
                            <div className="author">{item.author}</div>
                          </div>
                          <div className="item-quantity">Qty: {item.quantity}</div>
                          <div className="item-price">{formatCurrency(item.price)}</div>
                          <div className="item-subtotal">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-items">No items in this order</p>
                    )}
                  </div>
                </div>

                <div className="details-section">
                  <h4>Order Summary</h4>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>
                      {formatCurrency(
                        order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
                      )}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="btn-reorder"
                    aria-label={`Reorder from order #${order.id}`}
                  >
                    Reorder
                  </button>
                  <button
                    className="btn-invoice"
                    aria-label={`Download invoice for order #${order.id}`}
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
