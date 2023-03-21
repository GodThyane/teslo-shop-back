import { Mongoose } from 'mongoose';
import { OrderSchema } from './schemas/order.schema';

export const orderProviders = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.models.Orders || mongoose.model('Order', OrderSchema),
    inject: ['TESLODB_CONNECTION'],
  },
];
