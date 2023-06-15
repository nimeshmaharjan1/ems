import type { DefaultUser, User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      role: string;
      username: string;
      id: string;
      phone_number?: string;
    };
  }
  interface User extends User {
    role: string;
    username: string;
    id: string;
    phone_number?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    username: string;
    id: string;
    phone_number?: string;
  }
}
