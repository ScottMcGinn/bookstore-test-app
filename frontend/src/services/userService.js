const API_BASE = 'http://localhost:3001/api';

const userService = {
  // Get user profile
  async getProfile(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    const response = await fetch(`${API_BASE}/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Get order history
  async getOrderHistory(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}/orders`);
    if (!response.ok) throw new Error('Failed to fetch order history');
    return response.json();
  },

  // Add order
  async addOrder(userId, orderData) {
    const response = await fetch(`${API_BASE}/users/${userId}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to add order');
    return response.json();
  },

  // Get payment methods
  async getPaymentMethods(userId) {
    const response = await fetch(`${API_BASE}/users/${userId}/payment-methods`);
    if (!response.ok) throw new Error('Failed to fetch payment methods');
    return response.json();
  },

  // Save payment method
  async savePaymentMethod(userId, paymentData) {
    const response = await fetch(`${API_BASE}/users/${userId}/payment-methods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error('Failed to save payment method');
    return response.json();
  },

  // Delete payment method
  async deletePaymentMethod(userId, paymentMethodId) {
    const response = await fetch(
      `${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Failed to delete payment method');
    return response.json();
  }
};

export default userService;
