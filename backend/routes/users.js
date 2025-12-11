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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve list of all users (admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
  const users = getUsers();
  
  // Return all users without passwords
  const usersWithoutPasswords = users.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json(usersWithoutPasswords);
});

/**
 * @swagger
 * /api/users/{id}/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve user profile information by user ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/users/{id}/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update user profile information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/users/{id}/orders:
 *   get:
 *     summary: Get user order history
 *     description: Retrieve all orders for a specific user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User order history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/users/{id}/orders:
 *   post:
 *     summary: Create a new order
 *     description: Add a new order to user's order history
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - orderDate
 *               - total
 *               - items
 *             properties:
 *               orderId:
 *                 type: string
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *               total:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered]
 *               shippingAddress:
 *                 type: object
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/users/{id}/payment-methods:
 *   get:
 *     summary: Get user payment methods
 *     description: Retrieve all saved payment methods for a user
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 paymentMethods:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/users/{id}/payment-methods:
 *   post:
 *     summary: Save a new payment method
 *     description: Add a new payment method to user's saved methods
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: credit_card
 *               lastFour:
 *                 type: string
 *                 example: "1234"
 *               brand:
 *                 type: string
 *                 example: Visa
 *               expiryMonth:
 *                 type: string
 *               expiryYear:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Payment method saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 paymentMethod:
 *                   $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/users/{id}/payment-methods/{paymentMethodId}:
 *   delete:
 *     summary: Delete a payment method
 *     description: Remove a payment method from user's saved methods
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: paymentMethodId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment Method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User or payment method not found
 *       500:
 *         description: Server error
 */
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
