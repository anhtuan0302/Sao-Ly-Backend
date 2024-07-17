const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DeviceSchema = require('./device');
const SessionSchema = require('./session');

const AccountSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'customer', 'employee', 'director', 'student', 'teacher'],
        default: 'customer'
    },
    devices: {
        type: [DeviceSchema],
        required: true,
        default: []
    },
    sessions: {
        type: [SessionSchema],
        required: true,
        default: []
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

AccountSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

AccountSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

AccountSchema.methods.removeRefreshToken = function() {
    this.refreshToken = null;
    return this.save();
};

AccountSchema.methods.isOnline = function() {
    const openSession = this.sessions.find(session => !session.endTime);
    return !!openSession;
};

AccountSchema.methods.minutesOffline = function() {
    if (this.isOnline()) {
        return 0;
    }
    const lastSession = this.sessions.filter(session => session.endTime).pop();
    if (lastSession) {
        const now = new Date();
        const lastOfflineTime = new Date(lastSession.endTime).getTime();
        return Math.floor((now.getTime() - lastOfflineTime) / 60000);
    }
    return null;
};

const AccountsModel = mongoose.model('accounts', AccountSchema, 'accounts');
module.exports = AccountsModel;