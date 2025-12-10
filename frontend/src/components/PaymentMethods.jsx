import { useState, useEffect } from 'react';
import userService from '../services/userService';
import './PaymentMethods.css';

function PaymentMethods({ userId }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    type: 'credit_card',
    lastFour: '',
    brand: 'Visa',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getPaymentMethods(userId);
      setPaymentMethods(data.paymentMethods || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await userService.savePaymentMethod(userId, formData);
      setSuccessMessage('Payment method added successfully!');
      setFormData({
        type: 'credit_card',
        lastFour: '',
        brand: 'Visa',
        expiryMonth: '',
        expiryYear: '',
        isDefault: false
      });
      setShowForm(false);
      await fetchPaymentMethods();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      setError(null);
      await userService.deletePaymentMethod(userId, paymentMethodId);
      setSuccessMessage('Payment method deleted successfully!');
      await fetchPaymentMethods();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="payment-methods">
      <div className="payment-header">
        <h3>Saved Payment Methods</h3>
        <button
          className="btn-add-payment"
          onClick={() => setShowForm(!showForm)}
          aria-label="Add new payment method"
        >
          {showForm ? '✕ Cancel' : '+ Add Payment Method'}
        </button>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}
      {successMessage && <div className="success-message" role="alert">{successMessage}</div>}

      {showForm && (
        <form onSubmit={handleAddPaymentMethod} className="payment-form" aria-label="Add payment method form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Payment Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                aria-label="Payment method type"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="brand">Card Brand *</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                aria-label="Card brand"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="Discover">Discover</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastFour">Last 4 Digits *</label>
              <input
                id="lastFour"
                type="text"
                name="lastFour"
                value={formData.lastFour}
                onChange={handleInputChange}
                placeholder="4242"
                maxLength="4"
                required
                aria-label="Last 4 digits of card"
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryMonth">Expiry Month *</label>
              <select
                id="expiryMonth"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleInputChange}
                required
                aria-label="Card expiry month"
              >
                <option value="">-- Select Month --</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expiryYear">Expiry Year *</label>
              <select
                id="expiryYear"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleInputChange}
                required
                aria-label="Card expiry year"
              >
                <option value="">-- Select Year --</option>
                {[...Array(10)].map((_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              id="isDefault"
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              aria-label="Set as default payment method"
            />
            <label htmlFor="isDefault">Set as default payment method</label>
          </div>

          <button type="submit" className="btn-submit" aria-label="Save payment method">
            Save Payment Method
          </button>
        </form>
      )}

      {paymentMethods.length === 0 ? (
        <div className="empty-state">
          <p>💳 No payment methods saved yet</p>
          <p className="hint">Add a payment method to make checkout faster</p>
        </div>
      ) : (
        <div className="payment-list">
          {paymentMethods.map(method => (
            <div key={method.id} className="payment-card">
              <div className="payment-card-header">
                <div className="card-info">
                  <span className="card-brand">{method.brand}</span>
                  <span className="card-number">•••• {method.lastFour}</span>
                </div>
                {method.isDefault && (
                  <span className="badge-default" aria-label="Default payment method">
                    Default
                  </span>
                )}
              </div>
              <div className="payment-card-details">
                <span className="expiry">
                  Expires: {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                </span>
              </div>
              <button
                className="btn-delete"
                onClick={() => handleDeletePaymentMethod(method.id)}
                aria-label={`Delete ${method.brand} card ending in ${method.lastFour}`}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentMethods;
