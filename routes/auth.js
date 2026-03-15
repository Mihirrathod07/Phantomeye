const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'phantomeye_secret_key';

// ===== USER MODEL =====
const userSchema = new mongoose.Schema({
  username:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true },
  createdAt:        { type: Date, default: Date.now },
  registeredOn:     { type: String, default: () => new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true }) }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ===== REGISTER =====
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    if (username.length < 3)
      return res.status(400).json({ success: false, message: 'Username min 3 characters' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password min 6 characters' });

    // Check duplicate username
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Username already taken' });

    // Check duplicate email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    // Hash password & save
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log(`✅ New user registered: ${username}`);
    res.json({ success: true, message: 'Account created successfully' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Format createdAt nicely
    const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }) : 'N/A';

    console.log(`✅ User logged in: ${username}`);
    res.json({ success: true, token, username: user.username, createdAt, message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== VERIFY TOKEN =====
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ success: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Check if user still exists in DB
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    res.json({ success: true, username: decoded.username });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;