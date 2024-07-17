const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    deviceType: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }
}, {
    _id: false
});

module.exports = DeviceSchema;
