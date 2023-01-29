import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // const supabase = createMiddlewareSupabaseClient({ req, res });
  // const {
  //   data: { session },
  //   error,
  // } = await supabase.auth.getSession();
  // if (session?.user) {
  //   return res;
  // }

  // // Auth condition not met, redirect to home page.
  // const redirectUrl = req.nextUrl.clone();
  // redirectUrl.pathname = '/auth/login';
  // redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  // return NextResponse.redirect(redirectUrl);
  return res;
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
