import { generateToken, verifyToken } from '../utils/jwt';

const bcrypt = require('bcryptjs');

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { initialData } from '../database';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto, CreateUserOauthDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async fill(): Promise<User[]> {
    await this.userModel.deleteMany();
    return await this.userModel.insertMany(initialData.users);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const { role, name } = user;
    const token = generateToken(user._id, email);

    return {
      token,
      user: {
        email,
        role,
        name,
      },
    };
  }

  async register({ email, password, name }: CreateUserDto) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }

    const newUser = new this.userModel({
      email,
      password: bcrypt.hashSync(password),
      name,
      role: 'client',
    });

    try {
      await newUser.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Algo salió mal, revisar logs del servidor',
      );
    }

    const { _id, role } = newUser;
    const token = generateToken(_id, email);

    return {
      token,
      user: {
        email,
        role,
        name,
      },
    };
  }

  async validateToken(token: string) {
    let userId = '';
    try {
      userId = await verifyToken(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { _id, email, role, name } = user;

    return {
      token: generateToken(_id, user.email),
      user: {
        email,
        role,
        name,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      return await verifyToken(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async checkUserEmailPassword(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Usuario o contraseña incorrectos');
    }

    const { role, name, _id } = user;

    return {
      _id,
      email,
      role,
      name,
    };
  }

  async oauth(oAuth: CreateUserOauthDto) {
    const user = await this.userModel.findOne({ email: oAuth.email }).exec();

    if (user) {
      const { _id, name, email, role } = user;
      return { _id, name, email, role };
    }

    const newUser = new this.userModel({
      email: oAuth.email,
      name: oAuth.name,
      role: 'client',
      password: '@',
    });

    try {
      await newUser.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Algo salió mal, revisar logs del servidor',
      );
    }

    const { _id, name, email, role } = newUser;
    return { _id, name, email, role };
  }
}
