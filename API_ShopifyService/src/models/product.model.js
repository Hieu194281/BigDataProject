'use strict';

const { model, Schema, Types } = require('mongoose');
const slugify = require('slugify');

// NEW PRODUCT MODEL

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

const productSchema = new Schema(
  {
    id: String,
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    list_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    discount_rate: {
      type: Number,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    inventory_status: {
      type: String,
    },
    brand_id: Number,
    brand_name: String,
    categories: {
      type: Object,
    },
    rating_average: {
      type: Number,
    },
    images: {
      type: Object,
      required: true,
    },
    category: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// CREATE index for search
productSchema.index({
  name: 'text',
});

module.exports = model(DOCUMENT_NAME, productSchema);

// END NEW PRODUCT MODEL

// const productSchema = new Schema(
//   {
//     product_name: {
//       type: String,
//       required: true,
//     },
//     product_thumb: {
//       type: String,
//       required: true,
//     },
//     product_description: {
//       type: String,
//     },
//     product_slug: {
//       type: String,
//     },
//     product_price: {
//       type: Number,
//       required: true,
//     },
//     product_quantity: {
//       type: Number,
//       required: true,
//     },
//     product_type: {
//       type: String,
//       required: true,
//       enum: ['Electronics', 'Clothing', 'Furniture'],
//     },
//     product_shop: {
//       type: Schema.Types.ObjectId,
//       ref: 'Shop',
//     },
//     product_attributes: {
//       type: Schema.Types.Mixed,
//       required: true,
//     },
//     product_ratingAverage: {
//       type: Number,
//       default: 4.5,
//       min: [1, 'Rating must be more than or equal to 1.0'],
//       max: [5, 'Rating must be less than or equal to 5.0 '],
//       set: val => Math.round(val * 10) / 10,
//     },
//     product_variation: {
//       type: Array,
//       default: [],
//     },
//     isDraft: { type: Boolean, default: true, index: true, select: false },
//     isPublished: { type: Boolean, default: false, index: true, select: false },
//   },
//   {
//     timestamps: true,
//     collection: COLLECTION_NAME,
//   },
// );

// // Create index for search
// productSchema.index({ product_name: 'text', product_description: 'text' });

// // Document middleware
// productSchema.pre('save', function (next) {
//   this.product_slug = slugify(this.product_name, { lower: true });
//   next();
// });

// productSchema.pre('findOneAndUpdate', function (next) {
//   const data = this.getUpdate();
//   this.set({ product_slug: slugify(data.product_name, { lower: true }) });
//   next();
// });

// const clothingSchema = new Schema(
//   {
//     brand: {
//       type: String,
//       required: true,
//     },
//     size: String,
//     material: String,
//     product_shop: {
//       type: Schema.Types.ObjectId,
//       ref: 'Shop',
//     },
//   },
//   {
//     collection: 'clothes',
//     timestamps: true,
//   },
// );

// const electronicsSchema = new Schema(
//   {
//     manufactor: {
//       type: String,
//       required: true,
//     },
//     model: String,
//     color: String,
//     product_shop: {
//       type: Schema.Types.ObjectId,
//       ref: 'Shop',
//     },
//   },
//   {
//     collection: 'electronics',
//     timestamps: true,
//   },
// );

// const furnitureSchema = new Schema(
//   {
//     brand: {
//       type: String,
//       required: true,
//     },
//     size: String,
//     material: String,
//     product_shop: {
//       type: Schema.Types.ObjectId,
//       ref: 'Shop',
//     },
//   },
//   {
//     collection: 'furnitures',
//     timestamps: true,
//   },
// );

// module.exports = {
//   product: model(DOCUMENT_NAME, productSchema),
//   clothing: model('Clothing', clothingSchema),
//   electronics: model('Electronics', electronicsSchema),
//   furniture: model('Furniture', furnitureSchema),
// };
