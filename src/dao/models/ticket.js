const mongoose = require('mongoose');

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: Date,
    amount: {
        type: String,
        required: true
    },
    purchaser: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel;