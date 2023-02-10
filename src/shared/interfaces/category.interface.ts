import { Product, Company, Category } from '@prisma/client/';
export interface ICategory extends Category {
  products: Product[];
  companies: Company[];
}

export interface ICategoryResponse {
  data: ICategory[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}
