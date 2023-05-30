const mongoose = require('mongoose');

const cartCollection = 'cart';

const cartSchema = new mongoose.Schema(  {
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
          },
          quantity: {
            type: Number,
          },
        },
      ],
      required: true,
      default: [],
    },
  },
  { versionKey: false }
);

cartSchema.pre("find", function () {
  this.populate("products.product");
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartModel;