const categoryModel = require('../models/category.model');
const KafkaService = require('./kafka.service');
const { getProductListByCategory } = require('../models/repositories/product.repo.v3') 

class CategoryService {
  static async getCategoryList({ limit = 50, sort = 'ctime', page = 1 }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: 1 } : { _id: -1 };
    const data = await categoryModel
      .find()
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    // console.log('Category:::', data);
    // await KafkaService.init();
    // await KafkaService.produceMessage('Test', 'hahaha' + Math.random());
    // KafkaService.disconnect();
    return data;
  }

  static async getProductListByCategory({categoryId}) {
    const data = await getProductListByCategory({categoryId})
    return data;
  }
}

module.exports = CategoryService;
