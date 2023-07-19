import '@/styles/globals.scss';
import '@/styles/modal.scss';
import { NextPage } from 'next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';

import ToastProvider from '@/shared/components/toast-provider';
import { Session } from 'next-auth';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useState } from 'react';
import NProgressProvider from '@/shared/components/n-progress';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: { initialSession: Session };
};
export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <ThemeProvider>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider session={session}>
          {getLayout(
            <>
              <NProgressProvider></NProgressProvider>
              <Component {...pageProps} />
            </>
          )}
        </AuthProvider>
        <ToastProvider></ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
