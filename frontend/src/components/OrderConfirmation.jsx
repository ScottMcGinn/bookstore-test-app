import './OrderConfirmation.css';

function OrderConfirmation({ order, onBackToHome }) {
  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-container">
        <div className="confirmation-content">
          <div className="success-icon">✓</div>
          
          <h1>Thank You for Your Order!</h1>
          
          <p className="confirmation-message">
            Your order has been confirmed and will be processed shortly.
          </p>

          <div className="order-details">
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{orderNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{orderDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value amount">${order.total.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Shipping To:</span>
              <span className="detail-value">
                {order.shipping.firstName} {order.shipping.lastName}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email Confirmation:</span>
              <span className="detail-value email">{order.shipping.email}</span>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.id} className="item-row">
                  <span className="item-info">
                    <span className="item-title">{item.title}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </span>
                  <span className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="confirmation-message-box">
            <p>
              A confirmation email has been sent to <strong>{order.shipping.email}</strong>. 
              Please keep this for your records. You will receive tracking information once your order ships.
            </p>
          </div>

          <button className="btn-back-home" onClick={onBackToHome}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
