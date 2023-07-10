import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from '@prisma/client';

export interface PaginatedOrders {
  orders: Order[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  totalPrice: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deliveryCharge: number;
  status: ORDER_STATUS;
  paymentStatus: PAYMENT_STATUS;
  selectedWholesaleOption: string;
  paymentMethod: PAYMENT_METHOD;
  customerAddress: string;
  additionalPhoneNumber: string;
  user: User;
  items: Item[];
}

export interface Item {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  product: OrderProduct;
}

export interface OrderProduct {
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
}

export interface User {
  name: string;
  phone_number: string;
  email: string;
}
