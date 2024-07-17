const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
    }
}, {
    _id: false
});

module.exports = SessionSchema;
