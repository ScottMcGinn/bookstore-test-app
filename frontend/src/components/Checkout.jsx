import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import './Checkout.css';

function Checkout({ onClose, onOrderComplete }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping' or 'payment'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

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

  // Fetch user profile and payment methods on mount
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const profile = await userService.getProfile(user.id);
      setUserProfile(profile);
      
      const paymentData = await userService.getPaymentMethods(user.id);
      setPaymentMethods(paymentData.paymentMethods || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleUseStoredAddress = () => {
    if (userProfile?.profile) {
      const profile = userProfile.profile;
      setShippingForm(prev => ({
        ...prev,
        firstName: profile.firstName || prev.firstName,
        lastName: profile.lastName || prev.lastName,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone,
        address: profile.address || prev.address,
        city: profile.city || prev.city,
        state: profile.state || prev.state,
        zipCode: profile.zipCode || prev.zipCode,
        country: profile.country || prev.country
      }));
      setErrors({});
    }
  };

  const handleUseStoredPayment = (paymentMethod) => {
    if (paymentMethod) {
      setPaymentForm(prev => ({
        ...prev,
        cardNumber: '#### #### #### ' + paymentMethod.lastFour
      }));
      setErrors({});
    }
  };

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
    <div className="checkout-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close-btn" onClick={onClose} aria-label="Close checkout">×</button>

        <div className="checkout-container">
          <div className="checkout-header">
            <h2 id="checkout-title">Checkout</h2>
            <div className="checkout-progress" role="tablist" aria-label="Checkout steps">
              <div className={`progress-step ${currentStep === 'shipping' ? 'active' : ''}`} role="tab" aria-selected={currentStep === 'shipping'} aria-controls="shipping-section">
                <span className="step-number">1</span>
                <span className="step-label">Shipping</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${currentStep === 'payment' ? 'active' : ''}`} role="tab" aria-selected={currentStep === 'payment'} aria-controls="payment-section">
                <span className="step-number">2</span>
                <span className="step-label">Payment</span>
              </div>
            </div>
          </div>

          <div className="checkout-body">
            {currentStep === 'shipping' && (
              <div className="checkout-section" id="shipping-section" role="tabpanel" aria-labelledby="shipping-label">
                <div className="section-header">
                  <h3 id="shipping-label">Shipping Address</h3>
                  {userProfile?.profile && (userProfile.profile.address || userProfile.profile.city) && (
                    <button 
                      type="button"
                      className="btn-use-saved"
                      onClick={handleUseStoredAddress}
                      title="Populate form with your saved address"
                    >
                      📦 Use Saved Address
                    </button>
                  )}
                </div>

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
                      aria-label="First name for shipping address"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                    />
                    {errors.firstName && <span className="error-text" id="firstName-error">{errors.firstName}</span>}
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
                      aria-label="Last name for shipping address"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                    />
                    {errors.lastName && <span className="error-text" id="lastName-error">{errors.lastName}</span>}
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
                      aria-label="Email address for shipping notifications"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <span className="error-text" id="email-error">{errors.email}</span>}
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
                      aria-label="Phone number for delivery contact"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && <span className="error-text" id="phone-error">{errors.phone}</span>}
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
                    aria-label="Street address for delivery"
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && <span className="error-text" id="address-error">{errors.address}</span>}
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
                      aria-label="City for shipping address"
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? 'city-error' : undefined}
                    />
                    {errors.city && <span className="error-text" id="city-error">{errors.city}</span>}
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
                      aria-label="State or province for shipping address"
                      aria-invalid={!!errors.state}
                      aria-describedby={errors.state ? 'state-error' : undefined}
                    />
                    {errors.state && <span className="error-text" id="state-error">{errors.state}</span>}
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
                      aria-label="ZIP or postal code for shipping address"
                      aria-invalid={!!errors.zipCode}
                      aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
                    />
                    {errors.zipCode && <span className="error-text" id="zipCode-error">{errors.zipCode}</span>}
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
                    aria-label="Country for shipping address"
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? 'country-error' : undefined}
                  />
                  {errors.country && <span className="error-text" id="country-error">{errors.country}</span>}
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="checkout-section" id="payment-section" role="tabpanel" aria-labelledby="payment-label">
                <div className="section-header">
                  <h3 id="payment-label">Payment Information</h3>
                  {paymentMethods && paymentMethods.length > 0 && (
                    <div className="saved-payment-options">
                      <button 
                        type="button"
                        className="btn-use-saved"
                        onClick={() => handleUseStoredPayment(paymentMethods[0])}
                        title="Use your saved payment method"
                      >
                        💳 Use Saved Payment
                      </button>
                    </div>
                  )}
                </div>

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
                    aria-label="16-digit credit card number"
                    aria-invalid={!!errors.cardNumber}
                    aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                  />
                  {errors.cardNumber && <span className="error-text" id="cardNumber-error">{errors.cardNumber}</span>}
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
                      aria-label="Credit card expiration date in MM/YY format"
                      aria-invalid={!!errors.expiryDate}
                      aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                    />
                    {errors.expiryDate && <span className="error-text" id="expiryDate-error">{errors.expiryDate}</span>}
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
                      aria-label="3-digit security code on back of credit card"
                      aria-invalid={!!errors.cvv}
                      aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                    />
                    {errors.cvv && <span className="error-text" id="cvv-error">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="payment-info-note">
                  <p>For testing purposes, use any 16-digit number for credit card, any MM/YY for expiry, and any 3-digit number for CVV.</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="checkout-summary" role="region" aria-label="Order summary">
              <h4>Order Summary</h4>
              <div className="summary-items" aria-live="polite" aria-label={`${cartItems.length} items in order`}>
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-name">{item.title}</span>
                    <span className="item-qty">x{item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-total" aria-live="polite" aria-label={`Order total: $${getTotalPrice().toFixed(2)}`}>
                <span>Total:</span>
                <span className="total-price">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="checkout-footer">
            {currentStep === 'shipping' && (
              <>
                <button className="btn-cancel" onClick={onClose} aria-label="Cancel checkout and return to shopping">Cancel</button>
                <button className="btn-next" onClick={handleNextStep} aria-label="Complete shipping information and proceed to payment">Continue to Payment</button>
              </>
            )}

            {currentStep === 'payment' && (
              <>
                <button className="btn-back" onClick={() => setCurrentStep('shipping')} aria-label="Return to shipping information">Back</button>
                <button
                  className="btn-submit"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? 'Processing order, please wait' : 'Complete purchase and place order'}
                  aria-busy={isSubmitting}
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
