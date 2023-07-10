import { ORDER_STATUS, PAYMENT_STATUS } from '@prisma/client';

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
  paymentMethod: string;
  customerAddress: string;
  additionalPhoneNumber: string;
  user: User;
  items: Item[];
}

export interface Item {
  id: string;
  quantity: number;
  productId: string;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  paidThrough: null;
}

export interface User {
  name: string;
  phone_number: string;
  email: string;
}
