import { User } from './users.interface';

export interface ICommentsData {
  data: IComment[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface IComment {
  id: string;
  comment: string;
  userId: string;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  complaintId: null;
  user: User;
}
