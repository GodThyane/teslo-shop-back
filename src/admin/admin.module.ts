import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { orderProviders } from '../orders/order.provider';
import { userProviders } from '../users/user.provider';
import { productProviders } from '../products/product.providers';
import { DatabaseModule } from '../database';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    CloudinaryService,
    ...orderProviders,
    ...userProviders,
    ...productProviders,
  ],
})
export class AdminModule {}
