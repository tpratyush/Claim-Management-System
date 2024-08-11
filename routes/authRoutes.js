const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Route to handle user signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.signup(email, password, name);
  
  if (result.success) {
    res.cookie('token', result.token, { httpOnly: true }); // Set the token in a cookie
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  
  if (result.success) {
    res.cookie('token', result.token, { httpOnly: true }); // Set the token in a cookie
    res.json(result);
  } else {
    res.status(401).json(result);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the cookie
  res.json({ success: true, message: 'Logged out successfully' });
});

// Route to get user by ID (for testing or debugging purposes)
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await authService.getUserById(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Logout route
router.post('/logout', (req, res) => {
  // Clear the cookie by setting its value to an empty string and expiration date to the past
  res.cookie('userId');
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;