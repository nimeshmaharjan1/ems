import { Category, Company, Product } from '@prisma/client';

export interface IProductCreate {
  image: string | ArrayBuffer | null;
  title: string;
  description: string;
  price: string;
  category: string;
  company: string;
  quantity: number | null;
}

export interface IProductResponse extends Product {
  category: Category;
  company: Company;
}
