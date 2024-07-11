const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AccountSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
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
        enum: ['admin', 'user', 'employee', 'director'],
        default: 'user'
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

const AccountsModel = mongoose.model('accounts', AccountSchema, 'accounts');
module.exports = AccountsModel;
