import NextAuth, { NextAuthOptions } from 'next-auth';

import { PrismaClient, USER_ROLES } from '@prisma/client';
import { verify } from 'argon2';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

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
          where: { OR: [{ username }, { email: username }] },
          // where: { username },
        });

        if (!user) {
          throw new Error('User with this username/email has not been registered.');
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
          phone_number: user?.phone_number || '',
          taxId: user?.taxId || '',
          shopAddress: user?.shopAddress || '',
          name: user?.name || '',
        };
      },
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, credentials }) {
      if (credentials) {
        return true;
      }
      const dbUser = await prisma.user.upsert({
        where: { email: user.email as string },
        update: {
          name: user.name,
          image: user.image,
        },
        create: {
          name: user.name,
          email: user.email,
          image: user.image,
          password: user.name as string,
          username: user.name as string,
          role: USER_ROLES.USER,
          phone_number: user?.phone_number,
          shopAddress: user?.shopAddress,
          taxId: user?.taxId,
        },
      });
      // add the userId to the session object
      user.role = dbUser.role;
      if (dbUser?.phone_number) {
        user.phone_number = dbUser?.phone_number;
      }
      user.id = dbUser.id;
      await prisma.$disconnect();
      return true;
    },

    jwt(params) {
      if (params?.user?.role) {
        params.token.username = params.user.username;
        params.token.role = params.user?.role;
        params.token.id = params.user?.id;
        params.token.name = params.user?.name;
        params.token.shopAddress = params.user?.shopAddress;
        params.token.taxId = params.user?.taxId;
      }
      if (params?.user?.phone_number) {
        params.token.phone_number = params.user?.phone_number;
      }
      return params.token;
    },
    session: (params) => {
      if (params.session?.user) {
        params.session.user.username = params.token.username;
        params.session.user.role = params.token?.role;
        params.session.user.id = params.token?.id;
        params.session.user.phone_number = params.token?.phone_number;
        params.session.user.name = params.token?.name;
        params.session.user.shopAddress = params.token?.shopAddress;
        params.session.user.taxId = params.token?.taxId;
      }
      return params.session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);
