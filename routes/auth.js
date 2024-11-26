const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {validateUser}=require('../validators/authValidators')
// Register
router.post('/register', validateUser,async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
const { body, validationResult } = require('express-validator');
router.post(
    '/login',
    [
      // Validation rules
      body('email').isEmail().withMessage('Please enter a valid email'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
        // Verify the password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });
  
        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        res.json({ token });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );
// router.post('/login', [
//   body('email').isEmail().withMessage('Invalid email'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
// ], async(req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   res.send('Validated successfully!');
//   const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
module.exports = router;
