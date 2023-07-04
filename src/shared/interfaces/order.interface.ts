export interface PaginatedOrders {
  orders: Order[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface Order {
  orderNumber: number;
  paymentMethod: string;
  status: string;
  id: string;
  totalPrice: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  hasBeenPaid: boolean;
  paidAt: Date;
  user: User;
  items: Item[];
  totalDiscountedPrice?: number;
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
