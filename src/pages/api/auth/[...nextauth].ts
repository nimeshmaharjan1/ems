import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, USER_ROLES } from '@prisma/client';
import Credentials from 'next-auth/providers/credentials';
import { verify } from 'argon2';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 10000,
  },
  providers: [
    Credentials({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials as { username: string; password: string };
        const user = await prisma.user.findFirst({
          where: { username },
        });

        if (!user) {
          throw new Error('User with this username has not been registered.');
        }

        const isValidPassword = await verify(user.password, password as string);

        if (!isValidPassword) {
          throw new Error('Invalid password.');
        }
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt(params) {
      if (params?.user?.role) {
        params.token.username = params.user.username;
        params.token.role = params.user.role;
      }
      return params.token;
    },
    session: (params) => {
      if (params.session?.user) {
        params.session.user.username = params.token.username;
        params.session.user.role = params.token.role;
      }
      return params.session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);
