import { IRatingSummary } from './product.interface';

export interface SubmitReview {
  rating: string;
  comment: string;
  productId: string;
  userId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    username: string;
    image: string | null;
    id: string;
  };
}

export interface PaginatedReviews {
  data: {
    reviews: Review[];
    ratingSummary: IRatingSummary;
  };
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}
