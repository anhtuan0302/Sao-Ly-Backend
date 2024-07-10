const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    bankName: {
        type: String,
        required: true
    }
});

module.exports = BankSchema;

