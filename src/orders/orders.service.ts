import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { verifyToken } from '../utils/jwt';
import { User } from '../users/interfaces/user.interface';
import { Product } from '../products/interfaces/product.interface';
import * as process from 'process';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PayOrderDto } from './dto/pay-order.dto';
import { PaypalOrderStatusResponse } from './interfaces/paypal';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: Model<Order>,
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto, token: string) {
    let userId = '';
    try {
      userId = await verifyToken(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new UnauthorizedException(
        'El usuario logueado no existe en la base de datos',
      );
    }

    let {
      orderItems,
      orderSummary: { total },
    } = createOrderDto;

    const productsIds = orderItems.map((item) => item._id);

    const dbProducts = await this.productModel
      .find({
        _id: { $in: productsIds },
      })
      .exec();

    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id,
      )?.price;

      if (!currentPrice) {
        throw new BadRequestException(
          'Error al crear la orden, producto no encontrado',
        );
      }

      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.TAX_RATE || 0);
    let backendTotal = subTotal * (1 + taxRate);

    backendTotal = Math.round(backendTotal * 100) / 100;
    total = Math.round(total * 100) / 100;

    if (backendTotal !== total) {
      throw new BadRequestException(
        'Error al crear la orden, total no coincide',
      );
    }

    const newOrder = new this.orderModel({
      ...createOrderDto,
      user: userId,
    });

    newOrder.orderSummary.total = total;

    try {
      await newOrder.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Error al crear la orden');
    }

    return {
      message: 'Order created',
      orderId: newOrder._id,
    };
  }

  async getOrder(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('La orden no existe');
    }

    order.orderItems.forEach((item) => {
      item.image = item.image.includes('http')
        ? item.image
        : `${process.env.HOST_NAME || ''}/products/${item.image}`;
    });

    return order;
  }

  async getOrders(token: string) {
    let userId = '';
    try {
      userId = await verifyToken(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new UnauthorizedException(
        'El usuario logueado no existe en la base de datos',
      );
    }

    return await this.orderModel.find({ user: userId }).exec();
  }

  async pay(payOrderDto: PayOrderDto) {
    const { orderId, transactionId } = payOrderDto;
    const paypalBearerToken = await this.getPaypalBearerToken();
    const url = process.env.PAYPAL_ORDERS_URL || '';
    let data;
    try {
      data = (
        await firstValueFrom(
          this.httpService.get<PaypalOrderStatusResponse>(
            `${url}/${transactionId}`,
            {
              headers: {
                Authorization: `Bearer ${paypalBearerToken}`,
              },
            },
          ),
        )
      ).data;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Error al procesar el pago');
    }

    if (data.status !== 'COMPLETED') {
      throw new UnauthorizedException('El pago no fue completado');
    }

    const dbOrder = await this.orderModel.findById(orderId).exec();

    if (!dbOrder) {
      throw new NotFoundException('La orden no existe');
    }

    if (
      dbOrder.orderSummary.total !== Number(data.purchase_units[0].amount.value)
    ) {
      throw new BadRequestException(
        'Error al procesar el pago, total no coincide',
      );
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;

    try {
      await dbOrder.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Error al procesar el pago');
    }

    return {
      message: 'Pago procesado',
    };
  }

  private async getPaypalBearerToken(): Promise<string> {
    const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(
      `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    ).toString('base64');

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(process.env.PAYPAL_OAUTH_URL || '', urlencoded, {
          headers: {
            Authorization: `Basic ${base64Token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      return data.access_token;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Error al obtener el token de Paypal');
    }
  }
}
