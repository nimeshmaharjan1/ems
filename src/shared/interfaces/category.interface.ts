import { Product, Company, Category } from '@prisma/client';
export interface ICategory extends Category {
  products: Product[];
  companies: Company[];
}
