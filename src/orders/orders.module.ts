import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { orderProviders } from './order.provider';
import { DatabaseModule } from '../database';
import { productProviders } from '../products/product.providers';
import { userProviders } from '../users/user.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ...orderProviders,
    ...userProviders,
    ...productProviders,
  ],
})
export class OrdersModule {}
