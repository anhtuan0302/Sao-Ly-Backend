const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        type: String
    },
    alt: {
        type: String
    }
}, {
    _id: false
});

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    about: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    linkMap: {
        type: String
    },
    hotline: {
        type: String,
        required: true
    },
    images: {
        type: [ImageSchema],
        required: true,
        default: []
    }
}, {
    _id: false
});

module.exports = LocationSchema;