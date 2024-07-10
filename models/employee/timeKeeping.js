const mongoose = require('mongoose');

const TimekeepingSchema = new mongoose.Schema({
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    }
});

module.exports = TimekeepingSchema;

