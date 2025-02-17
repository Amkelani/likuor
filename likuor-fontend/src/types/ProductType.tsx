import {ReviewType} from './ReviewType';

export type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string;
  pack: string;
  description: string;
  categories: string;
  is_hot: boolean;
  is_recommended: boolean;
  tags: object;
  quantity?: number;
  is_new: boolean;
  category: string[];
};
