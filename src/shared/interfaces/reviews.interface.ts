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

interface PercentageRatings {
  [key: string]: string;
}

interface RatingSummary {
  averageRating: string;
  percentageRatings: PercentageRatings;
}

export interface PaginatedReviews {
  data: {
    reviews: Review[];
    ratingSummary: RatingSummary;
  };
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}
