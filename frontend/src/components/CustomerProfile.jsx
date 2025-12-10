import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import './CustomerProfile.css';
import PaymentMethods from './PaymentMethods';
import OrderHistory from './OrderHistory';

function CustomerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getProfile(user.id);
      
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
          address: data.profile.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address_')) {
      const addressField = name.replace('address_', '');
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await userService.updateProfile(user.id, formData);
      setProfile(formData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="customer-profile">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-profile">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p className="profile-subtitle">Manage your account information and preferences</p>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}
      {successMessage && <div className="success-message" role="alert">{successMessage}</div>}

      <div className="profile-container">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            aria-selected={activeTab === 'profile'}
            aria-label="View profile information"
          >
            Profile Info
          </button>
          <button
            className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
            aria-selected={activeTab === 'payment'}
            aria-label="View payment methods"
          >
            Payment Methods
          </button>
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            aria-selected={activeTab === 'orders'}
            aria-label="View order history"
          >
            Order History
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit profile information"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="profile-form" aria-label="Edit profile form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        aria-label="First name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        aria-label="Last name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-label="Email address"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        aria-label="Phone number"
                      />
                    </div>
                  </div>

                  <h3>Address</h3>
                  <div className="form-group">
                    <label htmlFor="street">Street Address</label>
                    <input
                      id="street"
                      type="text"
                      name="address_street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      aria-label="Street address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        name="address_city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        aria-label="City"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        id="state"
                        type="text"
                        name="address_state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        aria-label="State or province"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code</label>
                      <input
                        id="zipCode"
                        type="text"
                        name="address_zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        aria-label="ZIP or postal code"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        id="country"
                        type="text"
                        name="address_country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        aria-label="Country"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save" aria-label="Save profile changes">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{profile?.firstName} {profile?.lastName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{profile?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{profile?.phone || 'Not provided'}</span>
                  </div>
                  {profile?.address && (
                    <>
                      <div className="info-row">
                        <span className="label">Address:</span>
                        <span className="value">
                          {profile.address.street && <>{profile.address.street}</>}
                          {profile.address.city && <>, {profile.address.city}</>}
                          {profile.address.state && <> {profile.address.state}</>}
                          {profile.address.zipCode && <> {profile.address.zipCode}</>}
                          {profile.address.country && <>, {profile.address.country}</>}
                          {!profile.address.street && 'Not provided'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payment' && <PaymentMethods userId={user.id} />}
          {activeTab === 'orders' && <OrderHistory userId={user.id} />}
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
