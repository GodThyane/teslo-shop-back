import { Inject, Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { Model } from 'mongoose';
import { initialData, SHOP_CONSTANTS } from '../database';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
  ) {}

  async fill(): Promise<Product[]> {
    await this.productModel.deleteMany().exec();
    return await this.productModel.insertMany(initialData.products);
  }

  async findAll(gender: string): Promise<Product[]> {
    let condition = {};

    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(gender)) {
      condition = { gender };
    }

    const products = await this.productModel
      .find(condition)
      .select('title images price inStock slug')
      .exec();

    return products.map((product) => {
      product.images = product.images.map((image) =>
        image.includes('http')
          ? image
          : `${process.env.HOST_NAME || ''}/products/${image}`,
      );
      return product;
    });
  }

  async findAllSlugs(): Promise<Product[]> {
    return await this.productModel.find().select('slug -_id').exec();
  }

  async findOne(slug: string): Promise<Product> {
    const condition = { slug };
    const product = await this.productModel
      .findOne(condition)
      .select(
        'title price sizes description images inStock slug gender tags type',
      )
      .exec();

    if (!product) {
      return null;
    }

    product.images = product.images.map((image) =>
      image.includes('http')
        ? image
        : `${process.env.HOST_NAME || ''}/products/${image}`,
    );

    return product;
  }
}
