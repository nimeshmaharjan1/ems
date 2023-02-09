import { Product, Company, Category } from '@prisma/client';
export interface ICompany extends Company {
  products: Product[];
  categories: Category[];
}
