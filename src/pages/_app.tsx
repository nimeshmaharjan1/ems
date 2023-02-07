import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { NextPage } from 'next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NextNProgress from 'nextjs-progressbar';

import { SessionProvider as AuthProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: { initialSession: Session };
};
export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ThemeProvider>
      <AuthProvider session={session}>
        {getLayout(
          <>
            <NextNProgress options={{ showSpinner: false }} showOnShallow height={4} />
            <Component {...pageProps} />
          </>
        )}
      </AuthProvider>

      <ToastContainer />
    </ThemeProvider>
  );
}
