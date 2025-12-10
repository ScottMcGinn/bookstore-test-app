import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

function Checkout({ onClose, onOrderComplete }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping' or 'payment'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;

    // Format credit card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date as MM/DD
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    // Format CVV as digits only
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};

    if (!shippingForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingForm.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!shippingForm.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingForm.address.trim()) newErrors.address = 'Address is required';
    if (!shippingForm.city.trim()) newErrors.city = 'City is required';
    if (!shippingForm.state.trim()) newErrors.state = 'State is required';
    if (!shippingForm.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingForm.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    const cardNum = paymentForm.cardNumber.replace(/\s/g, '');

    if (!cardNum) {
      newErrors.cardNumber = 'Credit card number is required';
    } else if (cardNum.length !== 16) {
      newErrors.cardNumber = 'Credit card number must be 16 digits';
    } else if (!/^\d+$/.test(cardNum)) {
      newErrors.cardNumber = 'Credit card number must contain only digits';
    }

    if (!paymentForm.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    }

    if (!paymentForm.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentForm.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateShipping()) {
      setCurrentStep('payment');
    }
  };

  const handleSubmitOrder = async () => {
    if (!validatePayment()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderData = {
        shipping: shippingForm,
        payment: {
          cardNumber: paymentForm.cardNumber.slice(-4), // Only store last 4 digits
        },
        items: cartItems,
        total: getTotalPrice(),
        orderDate: new Date().toISOString()
      };

      clearCart();
      onOrderComplete(orderData);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close-btn" onClick={onClose}>×</button>

        <div className="checkout-container">
          <div className="checkout-header">
            <h2>Checkout</h2>
            <div className="checkout-progress">
              <div className={`progress-step ${currentStep === 'shipping' ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Shipping</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep === 'payment' ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Payment</span>
              </div>
            </div>
          </div>

          <div className="checkout-body">
            {currentStep === 'shipping' && (
              <div className="checkout-section">
                <h3>Shipping Address</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleShippingChange}
                      placeholder="John"
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleShippingChange}
                      placeholder="Doe"
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleShippingChange}
                      placeholder="john@example.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      placeholder="(123) 456-7890"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleShippingChange}
                    placeholder="123 Main Street"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      placeholder="New York"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State/Province *</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={shippingForm.state}
                      onChange={handleShippingChange}
                      placeholder="NY"
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      value={shippingForm.zipCode}
                      onChange={handleShippingChange}
                      placeholder="10001"
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={shippingForm.country}
                    onChange={handleShippingChange}
                    placeholder="United States"
                    className={errors.country ? 'error' : ''}
                  />
                  {errors.country && <span className="error-text">{errors.country}</span>}
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="checkout-section">
                <h3>Payment Information</h3>

                <div className="form-group">
                  <label htmlFor="cardNumber">Credit Card Number *</label>
                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="#### #### #### ####"
                    maxLength="19"
                    className={errors.cardNumber ? 'error' : ''}
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date (MM/YY) *</label>
                    <input
                      id="expiryDate"
                      type="text"
                      name="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="##/##"
                      maxLength="5"
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      id="cvv"
                      type="text"
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handlePaymentChange}
                      placeholder="###"
                      maxLength="3"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="payment-info-note">
                  <p>For testing purposes, use any 16-digit number for credit card, any MM/YY for expiry, and any 3-digit number for CVV.</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="checkout-summary">
              <h4>Order Summary</h4>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-name">{item.title}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span className="total-price">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="checkout-footer">
            {currentStep === 'shipping' && (
              <>
                <button className="btn-cancel" onClick={onClose}>Cancel</button>
                <button className="btn-next" onClick={handleNextStep}>Continue to Payment</button>
              </>
            )}

            {currentStep === 'payment' && (
              <>
                <button className="btn-back" onClick={() => setCurrentStep('shipping')}>Back</button>
                <button
                  className="btn-submit"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
