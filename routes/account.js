const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AccountModel = require('../models/account');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Get all accounts (only accessible by admins and directors)
router.get('/', authenticateToken, checkRole(['admin', 'director']), async (req, res) => {
    try {
        const accounts = await AccountModel.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single account by ID (accessible by any authenticated user)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const account = await AccountModel.findById(req.params.id);
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new account (only accessible by admins)
router.post('/add', authenticateToken, checkRole(['admin']), async (req, res) => {
    const account = new AccountModel({ ...req.body });
    try {
        await account.save();
        res.status(201).json(account);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login route to authenticate user and return tokens
router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const user = await AccountModel.findOne({
            $or: [{ email: login }, { phoneNumber: login }]
        });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken; // Save the new refresh token to the user model
        await user.save();
        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await AccountModel.findOne({ refreshToken: refreshToken, _id: decoded.userId });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Failed to authenticate token" });
    }
});

// Logout route to remove the refresh token from the user model
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const user = await AccountModel.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.refreshToken = null;
        await user.save();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
