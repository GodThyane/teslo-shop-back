import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from '../orders/interfaces/order.interface';
import { User } from '../users/interfaces/user.interface';
import { Product } from '../products/interfaces/product.interface';
import { IDashboard } from './interfaces/dashboard.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: Model<Order>,
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getDashboard(): Promise<IDashboard> {
    const [
      numberOfOrders,
      paidOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInventory,
    ] = await Promise.all([
      this.orderModel.countDocuments().exec(),
      this.orderModel
        .countDocuments({
          isPaid: true,
        })
        .exec(),
      this.userModel
        .countDocuments({
          role: 'client',
        })
        .exec(),
      this.productModel.countDocuments().exec(),
      this.productModel
        .countDocuments({
          inStock: 0,
        })
        .exec(),
      this.productModel
        .countDocuments({
          inStock: { $lte: 10 },
        })
        .exec(),
    ]);

    const pendingOrders = numberOfOrders - paidOrders;

    return {
      numberOfOrders,
      paidOrders,
      pendingOrders,
      numberOfClients,
      numberOfProducts,
      productsWithNoInventory,
      lowInventory,
    };
  }

  async getUsers() {
    return await this.userModel.find().select('-password').exec();
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    let user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }
    user.role = updateUser.role;

    try {
      user = await user.save();
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Error al actualizar el usuario');
    }

    return user;
  }

  async getOrders() {
    return await this.orderModel
      .find()
      .sort({
        createdAt: 'desc',
      })
      .populate('user', 'name email')
      .exec();
  }

  async getProducts() {
    const products = await this.productModel
      .find()
      .select('-__v')
      .sort({
        title: 'desc',
      })
      .exec();

    return products.map((product) => {
      product.images = product.images.map((image) =>
        image.includes('http')
          ? image
          : `${process.env.HOST_NAME || ''}/products/${image}`,
      );
      return product;
    });
  }

  async updateProduct(id: string, product: UpdateProductDto) {
    const productToUpdate = await this.productModel.findById(id).exec();

    if (!productToUpdate) {
      throw new NotFoundException('El producto no existe');
    }

    for (const image of productToUpdate.images) {
      if (!product.images.includes(image)) {
        await this.cloudinaryService.delete(image);
      }
    }

    try {
      await productToUpdate.updateOne(product).exec();
      return await this.productModel.findById(id).select('-__v').exec();
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Error al actualizar el producto');
    }
  }

  async createProduct(product: CreateProductDto) {
    const newProduct = new this.productModel(product);

    const productInDB = await this.productModel
      .findOne({
        slug: product.slug,
      })
      .exec();

    if (productInDB) {
      throw new BadRequestException('El slug del producto ya existe');
    }

    try {
      return await newProduct.save();
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async uploadFile(file) {
    const { secure_url } = await this.cloudinaryService
      .upload(file)
      .catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
    return { url: secure_url };
  }
}
