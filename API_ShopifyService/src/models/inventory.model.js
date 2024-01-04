'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventoryShema = new mongoose.Schema(
  {
    invent_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    invent_location: {
      type: String,
      default: 'unknown',
    },
    invent_stock: {
      type: Number,
      required: true,
    },
    invent_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },

    /**
     * cartId:,
     * stock: 1,
     * createdAt:
     */
    invent_reservation: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

module.exports = mongoose.model(DOCUMENT_NAME, inventoryShema);
