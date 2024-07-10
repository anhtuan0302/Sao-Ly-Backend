const mongoose = require('mongoose');

const TimeKeepingSchema = require('./timekeeping');
const SalarySchema = require('./salary');
const BankSchema = require('./bank');

const EmployeeSchema = new mongoose.Schema({
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts',
        required: true,
        unique: true
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
        type: Date,
        required: false
    },
    banks: {
        type: [BankSchema],
        required: true
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
        required: true
    },
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema, 'employees');
module.exports = EmployeeModel;