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

// Helper to save users
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving users file:', err);
    return false;
  }
};

// Helper to generate unique ID
const generateId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Register endpoint
router.post('/register', (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  // Validation
  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const users = getUsers();

  // Check if username already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Create new user
  const newUser = {
    id: generateId(),
    username,
    password,
    email,
    fullName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    role: 'customer',
    profile: {
      avatar: null,
      bio: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    orders: [],
    paymentMethods: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  if (saveUsers(users)) {
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      message: 'Registration successful! Welcome to Bookstore!'
    });
  } else {
    res.status(500).json({ error: 'Error creating account. Please try again.' });
  }
});

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword,
    message: `Welcome, ${user.fullName}!`
  });
});

// Add Staff endpoint (admin only)
router.post('/add-staff', (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  // Validation
  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const users = getUsers();

  // Check if username already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Create new staff user
  const newStaff = {
    id: generateId(),
    username,
    password,
    email,
    fullName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    role: 'staff',
    profile: {
      avatar: null,
      bio: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    orders: [],
    paymentMethods: [],
    createdAt: new Date().toISOString()
  };

  users.push(newStaff);

  if (saveUsers(users)) {
    // Return user data without password
    const { password: _, ...staffWithoutPassword } = newStaff;
    res.status(201).json({
      success: true,
      user: staffWithoutPassword,
      message: `Staff member "${firstName} ${lastName}" has been added successfully!`
    });
  } else {
    res.status(500).json({ error: 'Error adding staff member. Please try again.' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user (for session verification)
router.get('/me', (req, res) => {
  // In a real app, this would verify a token
  // For now, we'll just return a message
  res.json({ message: 'Use login endpoint to authenticate' });
});

module.exports = router;
