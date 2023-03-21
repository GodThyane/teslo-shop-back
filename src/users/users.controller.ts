import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto, CreateUserOauthDto } from './dto/create-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return await this.usersService.register(registerDto);
  }

  @Get('validate-token')
  async validateToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    return await this.usersService.validateToken(token);
  }

  @Get('verify-token')
  async verifyToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    return await this.usersService.verifyToken(token);
  }

  @Post('check-user-email-password')
  async checkUserEmailPassword(@Body() loginDto: LoginDto) {
    return await this.usersService.checkUserEmailPassword(loginDto);
  }

  @Post('oauth')
  async oauth(@Body() oAuth: CreateUserOauthDto) {
    return await this.usersService.oauth(oAuth);
  }
}
