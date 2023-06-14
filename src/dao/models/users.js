const mongoose = require('mongoose');

const userCollection = 'users';
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    age: Number,
    last_connection: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;