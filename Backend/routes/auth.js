const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, hashPassword, comparePassword, verifyToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
  console.log('Registration request received:', req.body);
  try {
    const { email, password, name, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if username is provided and unique
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const userData = {
      email,
      password: hashedPassword,
      name,
      location: req.body.location,
      profilePhoto: req.body.profilePhoto,
      skillsOffered: req.body.skillsOffered || [],
      skillsWanted: req.body.skillsWanted || [],
      availability: req.body.availability,
      isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
      rating: 5.0,
      completedSwaps: 0,
      joinedDate: new Date(),
      isAdmin: false,
      isBanned: false
    };

    if (username) {
      userData.username = username;
    }

    const user = new User(userData);
    await user.save();
    console.log('User created successfully:', { id: user._id, email: user.email, name: user.name });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      location: user.location,
      profilePhoto: user.profilePhoto,
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
      availability: user.availability,
      isPublic: user.isPublic,
      rating: user.rating,
      completedSwaps: user.completedSwaps,
      joinedDate: user.joinedDate,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received for email:', email);

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? 'User found' : 'User not found');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    console.log('Password validation result:', isPasswordValid ? 'Valid' : 'Invalid');
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      location: user.location,
      profilePhoto: user.profilePhoto,
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
      availability: user.availability,
      isPublic: user.isPublic,
      rating: user.rating,
      completedSwaps: user.completedSwaps,
      joinedDate: user.joinedDate,
      isAdmin: user.isAdmin,
      isBanned: user.isBanned,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 