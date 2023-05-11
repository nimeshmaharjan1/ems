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
