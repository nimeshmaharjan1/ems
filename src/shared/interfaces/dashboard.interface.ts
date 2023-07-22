export interface IRevenueData {
  revenueData: {
    date: string;
    revenue: number;
  }[];
}

export interface ITopSellingProduct {
  id: string;
  images: string[];
  title: string;
  description: string;
  price: number;
  sellingPrice: number;
  crossedPrice: number;
  hasOffer: boolean;
  modal: string;
  wholesaleCreditPrice: number;
  wholesaleCashPrice: number;
  status: string;
  categoryId: string;
  companyId: string;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  soldCount: number;
  soldQuantity: number;
  soldValue: number;
}
