'use strict';
const { NotFoundError } = require('../core/error.response');
const { cart } = require('../models/cart.model');
const { findProduct } = require('../models/repositories/product.repo');
/**
 * 1. Add product to Cart [User]
 * 2. Reduce product quantity [User]
 * 3. Increase product quantity [User]
 * 4. Get list of Cart [User]
 * 4. Delete cart [User]
 * 5. Delete cart item [User]
 */

class CartService {
  static async createUserCart({ userId, product }) {
    const query = {
        cart_userId: userId,
        cart_state: 'active',
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    /**
     * If cart existed and already has this product -> Update the quantity
     * Else add new product to cart
     */

    const { productId, quantity } = product;

    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active',
    };

    let result = await cart.findOneAndUpdate(
      query,
      {
        $inc: { 'cart_products.$.quantity': quantity },
      },
      {
        new: true,
      },
    );

    if (!result) {
      result = await cart.findOneAndUpdate(
        query,
        {
          $addToSet: {
            cart_products: product,
          },
        },
        {
          new: true,
        },
      );
    }

    return result;

    // return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async addToCart({ userId, product = {} }) {
    const foundProduct = await findProduct({ product_id: product.productId });

    if (!foundProduct) {
      throw new NotFoundError('Product does not exist');
    }

    product = {
      ...product,
      name: foundProduct.product_name,
    };

    // Check cart existed or not
    const userCart = await cart.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      // Create new cart for user

      return await CartService.createUserCart({ userId, product });
    }

    // If cart exists, but has none of the products
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // If cart exists and already has this product -> update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // Update an Product in Cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId,
          }
        ],
        version
      }
    ]
   */
  static async updateProductInCart({ userId, shop_order_ids }) {
    const { quantity, old_quantity, productId } =
      shop_order_ids[0]?.item_products[0];
    const foundProduct = await findProduct({ product_id: productId });

    if (!foundProduct) {
      throw new NotFoundError('');
    }
    if (foundProduct.product_shop.toString() != shop_order_ids[0]?.shopId)
      throw new NotFoundError('Product do not belong to the shop');

    if (quantity == 0)
      return CartService.deleteProductInUserCart({
        userId,
        productId,
      });

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteProductInUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: 'active',
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteProduct = await cart.updateOne(query, updateSet);

    return deleteProduct;
  }

  static async getUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
