const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AccountModel = require('../models/account/account');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Get all accounts (only accessible by admins and directors)
router.get('/', authenticateToken, checkRole(['admin', 'director']), async (req, res) => {
    try {
        const accounts = await AccountModel.find().select('-password -refreshToken');
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single account by ID (accessible by any authenticated user)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const account = await AccountModel.findById(req.params.id).select('-password -refreshToken');
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new account (only accessible by admins)
router.post('/add', authenticateToken, checkRole(['admin']), async (req, res) => {
    const account = new AccountModel(req.body);
    try {
        await account.save();
        res.status(201).json({ message: 'Account created successfully', account: account.id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an account by ID (accessible by the account owner or an admin)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const account = await AccountModel.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Ensure users can only update their own account unless they're admin
        if (req.user.userId !== id && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: "You don't have permission to update this account" });
        }

        Object.keys(updates).forEach((key) => {
            if (key !== 'password' && key !== 'refreshToken') {
                account[key] = updates[key];
            }
        });

        await account.save();
        res.json({ message: 'Account updated successfully', account });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an account by ID (only accessible by admins)
router.delete('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
    try {
        const account = await AccountModel.findByIdAndDelete(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login route to authenticate user and return tokens, while recording device and session
router.post('/login', async (req, res) => {
    const { login, password, deviceType } = req.body;
    // Lấy địa chỉ IP từ request
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const user = await AccountModel.findOne({ $or: [{ email: login }, { phoneNumber: login }] });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if device is already registered
        const existingDevice = user.devices.find(device => device.ipAddress === ipAddress);
        if (!existingDevice) {
            user.devices.push({ deviceType, ipAddress });
        }

        // Start a new session
        user.sessions.push({ startTime: new Date() });

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.json({ accessToken, refreshToken, user: { id: user._id, role: user.role } });
    } catch (err) {
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
        res.status(403).json({ message: "Failed to authenticate token" });
    }
});

// Logout route to remove the refresh token and end the session
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const user = await AccountModel.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // End the latest session
        if (user.sessions.length > 0) {
            user.sessions[user.sessions.length - 1].endTime = new Date();
        }

        user.refreshToken = null;
        await user.save();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
