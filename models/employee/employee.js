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
        required: false
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    image: {
        data: Buffer,
        type: String,
        required: false
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departments',
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: ['Fulltime', 'Parttime', 'Internship']
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: false
    },
    bankName: {
        type: String,
        trim: true,
        required: false
    },
    wage: {
        type: Number,
        required: false
    },
    allowance: {
        type: Number,
        required: false
    },
    salaries: {
        type: [SalarySchema],
        required: true,
        default: []
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