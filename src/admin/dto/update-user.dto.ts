import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['client', 'admin', 'super-user', 'SEO'])
  readonly role: string;
}
