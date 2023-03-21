import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import mongoose from 'mongoose';
import { PayOrderDto } from './dto/pay-order.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Headers('authorization') authorization: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const token = authorization.split(' ')[1];
    return await this.ordersService.create(createOrderDto, token);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('El id de la orden no es válido');
    }
    return await this.ordersService.getOrder(id);
  }

  @Get()
  async getOrders(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    return await this.ordersService.getOrders(token);
  }

  @Post('pay')
  async payOrder(@Body() payOrderDto: PayOrderDto) {
    if (!mongoose.isValidObjectId(payOrderDto.orderId)) {
      throw new BadRequestException('El id de la orden no es válido');
    }
    return await this.ordersService.pay(payOrderDto);
  }
}
