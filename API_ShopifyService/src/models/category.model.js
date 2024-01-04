'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'categories';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
    },
    parentId: {
      type: Number,
    },
    url: String,
    urlKey: String,
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

module.exports = mongoose.model(DOCUMENT_NAME, categorySchema, COLLECTION_NAME);
