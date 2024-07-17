const mongoose = require('mongoose');

const LocationSchema = require('./location');

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

const SocialLinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true
    }
}, {
    _id: false
});

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true
    },
    hotline: {
        type: String,
        required: true
    },
    locations: {
        type: [LocationSchema],
        required: true,
        default: []
    },
    logo: {
        data: Buffer,
        type: String
    },
    about: {
        type: String
    },
    images: {
        type: [ImageSchema],
        required: true,
        default: []
    },
    website: {
        type: String
    },
    socialLinks: {
        type: [SocialLinkSchema],
        required: true,
        default: []
    }
}, {
    timestamps: true
});
