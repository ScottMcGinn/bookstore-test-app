const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');

// Helper to read users
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data).users;
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Helper to write users
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing users file:', err);
    return false;
  }
};

// Get all users (for admin panel)
router.get('/', (req, res) => {
  const users = getUsers();
  
  // Return all users without passwords
  const usersWithoutPasswords = users.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

// Get user profile by ID
router.get('/:id/profile', (req, res) => {
  const { id } = req.params;
  const users = getUsers();
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Return user profile without password
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Update user profile
router.put('/:id/profile', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, address } = req.body;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update profile data
  users[userIndex].profile = users[userIndex].profile || {};
  users[userIndex].profile.firstName = firstName || users[userIndex].profile.firstName;
  users[userIndex].profile.lastName = lastName || users[userIndex].profile.lastName;
  users[userIndex].profile.email = email || users[userIndex].profile.email;
  users[userIndex].profile.phone = phone || users[userIndex].profile.phone;
  
  if (address) {
    users[userIndex].profile.address = {
      ...users[userIndex].profile.address,
      ...address
    };
  }

  if (!saveUsers(users)) {
    return res.status(500).json({ error: 'Failed to save profile' });
  }

  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: userWithoutPassword
  });
});

// Get order history
router.get('/:id/orders', (req, res) => {
  const { id } = req.params;
  const users = getUsers();
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const orders = user.profile?.orderHistory || [];
  res.json({
    userId: user.id,
    userName: user.fullName,
    orders: orders
  });
});

// Add order to order history
router.post('/:id/orders', (req, res) => {
  const { id } = req.params;
  const { orderId, orderDate, total, items, status, shippingAddress } = req.body;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Initialize profile if needed
  if (!users[userIndex].profile) {
    users[userIndex].profile = {
      firstName: users[userIndex].fullName.split(' ')[0],
      lastName: users[userIndex].fullName.split(' ').slice(1).join(' '),
      email: users[userIndex].email,
      phone: '',
      address: {},
      paymentMethods: [],
      orderHistory: []
    };
  }

  // Initialize order history if needed
  if (!users[userIndex].profile.orderHistory) {
    users[userIndex].profile.orderHistory = [];
  }

  // Add new order
  const newOrder = {
    orderId,
    orderDate,
    total,
    items,
    status: status || 'pending',
    shippingAddress
  };

  users[userIndex].profile.orderHistory.push(newOrder);

  if (!saveUsers(users)) {
    return res.status(500).json({ error: 'Failed to save order' });
  }

  res.json({
    success: true,
    message: 'Order added successfully',
    order: newOrder
  });
});

// Get payment methods
router.get('/:id/payment-methods', (req, res) => {
  const { id } = req.params;
  const users = getUsers();
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const paymentMethods = user.profile?.paymentMethods || [];
  res.json({
    userId: user.id,
    paymentMethods: paymentMethods
  });
});

// Save payment method
router.post('/:id/payment-methods', (req, res) => {
  const { id } = req.params;
  const { type, lastFour, brand, expiryMonth, expiryYear, isDefault } = req.body;

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Initialize profile if needed
  if (!users[userIndex].profile) {
    users[userIndex].profile = {
      firstName: users[userIndex].fullName.split(' ')[0],
      lastName: users[userIndex].fullName.split(' ').slice(1).join(' '),
      email: users[userIndex].email,
      phone: '',
      address: {},
      paymentMethods: [],
      orderHistory: []
    };
  }

  // Initialize payment methods if needed
  if (!users[userIndex].profile.paymentMethods) {
    users[userIndex].profile.paymentMethods = [];
  }

  // If this is default, unset other defaults
  if (isDefault) {
    users[userIndex].profile.paymentMethods.forEach(pm => {
      pm.isDefault = false;
    });
  }

  // Add new payment method
  const paymentMethodId = `pm_${Date.now()}`;
  const newPaymentMethod = {
    id: paymentMethodId,
    type,
    lastFour,
    brand,
    expiryMonth,
    expiryYear,
    isDefault: isDefault || false,
    createdAt: new Date().toISOString()
  };

  users[userIndex].profile.paymentMethods.push(newPaymentMethod);

  if (!saveUsers(users)) {
    return res.status(500).json({ error: 'Failed to save payment method' });
  }

  res.json({
    success: true,
    message: 'Payment method saved successfully',
    paymentMethod: newPaymentMethod
  });
});

// Delete payment method
router.delete('/:id/payment-methods/:paymentMethodId', (req, res) => {
  const { id, paymentMethodId } = req.params;
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!users[userIndex].profile?.paymentMethods) {
    return res.status(404).json({ error: 'No payment methods found' });
  }

  const pmIndex = users[userIndex].profile.paymentMethods.findIndex(
    pm => pm.id === paymentMethodId
  );

  if (pmIndex === -1) {
    return res.status(404).json({ error: 'Payment method not found' });
  }

  users[userIndex].profile.paymentMethods.splice(pmIndex, 1);

  if (!saveUsers(users)) {
    return res.status(500).json({ error: 'Failed to delete payment method' });
  }

  res.json({
    success: true,
    message: 'Payment method deleted successfully'
  });
});

module.exports = router;
