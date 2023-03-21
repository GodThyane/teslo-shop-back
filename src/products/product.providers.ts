import { Mongoose } from 'mongoose';
import { ProductSchema } from './schemas/product.schema';

export const productProviders = [
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.models.Products || mongoose.model('Product', ProductSchema),
    inject: ['TESLODB_CONNECTION'],
  },
];
