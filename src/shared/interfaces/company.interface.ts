import { Product, Company, Category } from '@prisma/client';
export interface ICompany extends Company {
  products: Product[];
  categories: Category[];
}
export interface ICompanyResponse {
  data: ICompany[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}
