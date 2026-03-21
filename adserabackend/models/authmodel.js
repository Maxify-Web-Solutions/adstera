const mongoose = require('mongoose');

const userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        },
        role: {
            enum: ['admin', 'user'],
            default: 'user',
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
     lastLogin: {
            date: Date,
            ip: String,
            device: String,
            os: String,
            browser: String
        }

    },
    {
        timestamps: true
    }
);

const User = mongoose.model('users', userschema);

module.exports = User;