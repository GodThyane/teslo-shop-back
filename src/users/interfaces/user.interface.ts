import { Document } from 'mongoose';

export interface Product extends Document {
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ISize[];
  slug: string;
  tags: string[];
  title: string;
  type: IValidTypes;
  gender: 'men' | 'women' | 'kid' | 'unisex';
}

export type ISize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type IValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';
