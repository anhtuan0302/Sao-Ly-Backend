const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalWorkDays: {
        type: Number,
        required: true
    },
    totalWorkHours: {
        type: Number,
        required: true
    },
    totalLateDays: {
        type: Number,
        required: true
    },
    totalAbsentDays: {
        type: Number,
        required: true
    },
    totalSalary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected']
    }
});

module.exports = SalarySchema;