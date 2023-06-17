import { USER_ROLES } from '@prisma/client';

export interface IUserResponse {
  email: string;
  emailVerified: any;
  id: string;
  image: string;
  name: string;
  phone_number: string;
  role: USER_ROLES;
  username: string;
}

export interface PaginatedUsers {
  data: User[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone_number: null | string;
  emailVerified: null;
  role: string;
  applyingAsBusinessClient: boolean;
  image: null | string;
}
