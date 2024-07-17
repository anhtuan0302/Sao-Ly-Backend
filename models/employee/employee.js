const mongoose = require('mongoose');

const TimeKeepingSchema = require('./timekeeping');
const SalarySchema = require('./salary');

const EmployeeSchema = new mongoose.Schema({
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
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        data: Buffer,
        type: String
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departments',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['fulltime', 'parttime', 'internship']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    accountNumber: {
        type: Number,
        unique: true,
    },
    bankName: {
        type: String,
        trim: true
    },
    wage: {
        type: Number,
        required: true
    },
    allowance: {
        type: Number,
        required: true
    },
    salaries: {
        type: [SalarySchema],
        required: true
    },
    timekeeping: {
        type: [TimeKeepingSchema],
        required: true,
        default: []
    },
}, {
    timestamps: true
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema, 'employees');
module.exports = EmployeeModel;