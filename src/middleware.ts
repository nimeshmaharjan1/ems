import { USER_ROLES } from '@prisma/client';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
export default withAuth(
  function middleware(req: NextRequest) {
    console.log(req.url);
    if (req.url === '/admin/dashboard') {
      return null;
    }
    return NextResponse.rewrite(new URL('/admin/dashboard', req.url));
  },
  {
    callbacks: {
      authorized: (params: any) => {
        return params.token?.role === USER_ROLES.ADMIN || params.token?.role === USER_ROLES.SUPER_ADMIN;
      },
    },
  }
);

export const config = { matcher: ['/admin/:path*'] };
