const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'phantomeye_secret_key';

// ===== SCAN HISTORY SCHEMA =====
const scanSchema = new mongoose.Schema({
  username:  { type: String, required: true, index: true },
  module:    { type: String, required: true },
  label:     { type: String, required: true },
  summary:   { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Scan = mongoose.models.Scan || mongoose.model('Scan', scanSchema);

// ===== AUTH MIDDLEWARE =====
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ===== SAVE SCAN =====
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { module, label, summary } = req.body;
    if (!module || !label) {
      return res.status(400).json({ success: false, message: 'module and label required' });
    }
    const scan = new Scan({ username: req.username, module, label, summary });
    await scan.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Save scan error:', err);
    res.status(500).json({ success: false, message: 'Save failed' });
  }
});

// ===== GET HISTORY =====
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const scans = await Scan.find({ username: req.username })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const history = scans.map(s => ({
      id:      s._id,
      module:  s.module,
      label:   s.label,
      summary: s.summary,
      time:    new Date(s.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      })
    }));

    res.json({ success: true, history });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ success: false, message: 'Fetch failed' });
  }
});

// ===== CLEAR HISTORY =====
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    await Scan.deleteMany({ username: req.username });
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Clear failed' });
  }
});

module.exports = router;