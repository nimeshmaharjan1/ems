import { USER_ROLES } from '@prisma/client';
export interface IRegister {
  username: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  role: USER_ROLES;
}

export interface ILoginWithPassword {
  username: string;
  password: string;
}
