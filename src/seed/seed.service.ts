import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly userService: UsersService,
  ) {}

  async fill(): Promise<void> {
    await this.productsService.fill();
    await this.userService.fill();
  }
}
