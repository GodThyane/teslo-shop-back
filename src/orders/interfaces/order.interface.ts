import { Document } from 'mongoose';
import { User } from '../../users/interfaces/user.interface';
import { ISize } from '../../products/interfaces/product.interface';

export interface Order extends Document {
  user: User | string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult?: string;
  orderSummary: OrderSummary;
  isPaid: boolean;
  paidAt?: string;

  transactionId?: string;
}

export interface OrderItem {
  _id: string;
  title: string;
  size: ISize;
  quantity: number;
  slug: string;
  image: string;
  price: number;
  gender: 'men' | 'women' | 'kid' | 'unisex';
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zipCode: string;
  city: string;
  country: string;
  phone: string;
}

export interface OrderSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}
