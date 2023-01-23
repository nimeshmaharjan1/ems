import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps: { initialSession: Session };
};
export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ThemeProvider>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        {getLayout(<Component {...pageProps} />)}
      </SessionContextProvider>
    </ThemeProvider>
  );
}
