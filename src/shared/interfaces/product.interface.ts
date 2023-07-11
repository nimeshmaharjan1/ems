import { PRODUCT_STATUS } from '@prisma/client';

export interface IProductCreate {
  image: string | ArrayBuffer | null;
  title: string;
  description: string;
  price: string;
  category: string;
  company: string;
  quantity: number | null;
}
export interface IProduct {
  id: string;
  images: string[];
  title: string;
  description: string;

  price: number;
  sellingPrice: number;
  crossedPrice: number;
  wholesaleCreditPrice: number;
  wholesaleCashPrice: number;

  categoryId: string;
  companyId: string;
  quantity: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  modal: string;
  hasOffer: boolean;
  category: Category;
  company: Category;
  Review: Review[];
  ratingSummary: IRatingSummary;
  status: PRODUCT_STATUS;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRatingSummary {
  averageRating: string;
  percentageRatings: { [key: string]: string };
}
export interface PaginatedProductsResponse {
  products: IProduct[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}
