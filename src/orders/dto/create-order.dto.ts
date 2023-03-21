import {
  OrderItem,
  OrderSummary,
  ShippingAddress,
} from '../interfaces/order.interface';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  orderItems: OrderItem[];

  @IsNotEmpty()
  shippingAddress: ShippingAddress;

  @IsNotEmpty()
  isPaid: boolean;

  @IsNotEmpty()
  orderSummary: OrderSummary;
}
