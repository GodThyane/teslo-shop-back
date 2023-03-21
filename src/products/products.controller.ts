import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import * as process from 'process';
import { Response } from 'express';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/fill')
  async fill(@Res() response: Response) {
    if (process.env.NODE_ENV === 'production') {
      response
        .status(HttpStatus.FORBIDDEN)
        .send({ message: 'No se puede ejecutar en producción' });
    }
    await this.productsService.fill();

    return response
      .status(HttpStatus.OK)
      .send({ message: 'Proceso realizado con éxito' });
  }

  @Get('/slugs')
  async getSlugs() {
    return this.productsService.findAllSlugs();
  }

  @Get()
  findAll(@Query('gender') gender: string = 'all') {
    return this.productsService.findAll(gender);
  }

  @Get('/:slug')
  async findOne(@Res() response: Response, @Param('slug') slug: string) {
    const product = await this.productsService.findOne(slug);

    if (!product) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'Producto no encontrado' });
    }

    return response.status(HttpStatus.OK).send(product);
  }
}
