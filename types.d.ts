import type { DefaultUser, User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      role: string;
      username: string;
      id: string;
      phone_number?: string;
      shopAddress?: string;
      taxId?: string;
      name?: string;
    };
  }
  interface User extends User {
    role: string;
    username: string;
    id: string;
    phone_number?: string;
    shopAddress?: string;
    taxId?: string;
    name?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    username: string;
    id: string;
    phone_number?: string;
    shopAddress?: string;
    taxId?: string;
    name?: string;
  }
}
