'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const discountSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active ',
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
      /**
       * [
       *  {
       *    productId,
       *    shopId,
       *    quantity,
       *    name,
       *    price - for checking in server side  if data is modified  or not
       *  }
       * ]
       */
    },
    cart_count_products: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

module.exports = {
  cart: mongoose.model(DOCUMENT_NAME, discountSchema),
};
