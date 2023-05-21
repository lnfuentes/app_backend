const mongoose = require('mongoose');

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }
        ]
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: Date,
    amount: {
        type: Number,
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