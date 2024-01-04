'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');
const discount = require('../models/discount.model');
const {
  findAllDraftsForShop,
  findAllProducts,
} = require('../models/repositories/product.repo');

const {
  findAllDiscountCode,
  checkDiscountExists,
} = require('../models/repositories/discount.repo');

/**
 * Discount service
 * 1. Generate Discount code [Shop | Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount code [Use | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop | Admin]
 * 6. Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      max_uses_per_user,
      used_count,
    } = payload;

    if (new Date() > new Date(start_date)) {
      throw new BadRequestError('Discount code has expired!');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date!');
    }

    // Create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount) {
      throw new BadRequest('Discount code existed!');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_max_value: max_value,
      discount_used_count: used_count,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  // Get list product by discount_code
  static async getProductsByDiscountCode({
    code,
    shopId,
    userId,
    limit = 10,
    page = 1,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not existed!');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;

    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name'],
      });
    } else {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit,
        page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  // Get all discount code of shop
  static async getAllDiscountCodesByShop({ limit = 10, page = 1, shopId }) {
    const discounts = await findAllDiscountCode({
      limit,
      page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      select: ['-__v', '-discount_shopId'],
    });

    return discounts;
  }

  /**
   * Apply discount code
   * @param {Array} products
   * [
   *  {
   *    productId,
   *    shopId,
   *    quantity,
   *    name,
   *    price,
   *  }
   * ]
   */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount does not exist');

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_used_count,
      discount_users_used,
      discount_value,
      discount_type,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError('Discount expired');
    if (discount_max_uses == 0)
      throw new NotFoundError('Discount out of amount');

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError('Discount expired');
    }

    // Check if order's price > min order
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value)
        throw new NotFoundError(
          `Discount requires a minium order value of ${discount_min_order_value}`,
        );
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        user => (user.userId = userId),
      );

      if (userUsedDiscount) {
        // ...
      }
    }

    const amount =
      discount_type == 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deletDiscountCode({ shopId, codeId }) {
    const deleted = discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId,
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError('Discount does not exist');

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: { userId },
      },
      $inc: {
        discount_max_uses: 1,
        discount_used_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
