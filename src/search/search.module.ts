import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { DatabaseModule } from '../database';
import { productProviders } from '../products/product.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, ...productProviders],
})
export class SearchModule {}
