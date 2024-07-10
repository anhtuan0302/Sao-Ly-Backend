const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AccountModel = require('../models/account');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.get('/', authenticateToken, checkRole(['admin', 'director']), async (req, res) => {
    try {
        const accounts = await AccountModel.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const account = await AccountModel.findById(req.params.id);
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', authenticateToken, checkRole(['admin']), async (req, res) => {
    const account = new AccountModel({ ...req.body });
    try {
        await account.save();
        res.status(201).json(account);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const user = await AccountModel.findOne({
            $or: [{ email: login }, { phoneNumber: login }]
        });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
      const user = await AccountModel.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      await user.removeRefreshToken();
      res.status(204).send();
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


module.exports = router;
