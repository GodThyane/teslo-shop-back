import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from '../products/interfaces/product.interface';

@Injectable()
export class SearchService {
  constructor(
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
  ) {}

  async findAll(query: string) {
    const products = await this.productModel
      .find({
        $text: { $search: query },
      })
      .select('title images price inStock slug -_id')
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
}
