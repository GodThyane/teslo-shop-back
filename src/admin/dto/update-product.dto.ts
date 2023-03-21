import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import {
  ISize,
  IValidTypes,
} from '../../products/interfaces/product.interface';

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty()
  _id?: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNotEmpty({ each: true })
  @ArrayUnique()
  images: string[];

  @IsNumber()
  @Min(0)
  inStock: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], { each: true })
  sizes: ISize[];

  @IsNotEmpty()
  slug: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  tags: string[];

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsIn(['shirts', 'pants', 'hoodies', 'hats'])
  type: IValidTypes;

  @IsNotEmpty()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
