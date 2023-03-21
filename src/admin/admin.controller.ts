import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return await this.adminService.getDashboard();
  }

  @Get('users')
  async getUsers() {
    return await this.adminService.getUsers();
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('El id del usuario no es válido');
    }
    return await this.adminService.updateUser(id, updateUser);
  }

  @Get('orders')
  async getOrders() {
    return await this.adminService.getOrders();
  }

  @Get('products')
  async getProducts() {
    return await this.adminService.getProducts();
  }

  @Post('products')
  async createProduct(@Body() product: CreateProductDto) {
    return await this.adminService.createProduct(product);
  }

  @Put('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('El id del producto no es válido');
    }
    return await this.adminService.updateProduct(id, product);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(gif|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(
            new HttpException('Invalid file type.', HttpStatus.NOT_ACCEPTABLE),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.adminService.uploadFile(file);
  }
}
