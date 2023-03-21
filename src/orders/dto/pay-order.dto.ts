import { IsNotEmpty } from 'class-validator';

export class PayOrderDto {
  @IsNotEmpty()
  transactionId: string;

  @IsNotEmpty()
  orderId: string;
}
