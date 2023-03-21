import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { DatabaseModule } from '../database';
import { productProviders } from '../products/product.providers';
import { userProviders } from '../users/user.provider';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SeedController],
  providers: [
    SeedService,
    ...productProviders,
    ...userProviders,
    ProductsService,
    UsersService,
  ],
})
export class SeedModule {}
