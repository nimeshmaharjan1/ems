import { useTheme } from 'next-themes';
import React, { ReactNode } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import Head from 'next/head';
import { Inter, Work_Sans, Public_Sans } from '@next/font/google';

// const inter = Work_Sans({
//   preload: false,
//   subsets: ['latin'],
//   fallback: ['system-ui'],
//   weight: ['200', '300', '400', '500', '600', '700'],
// });

const inter = Public_Sans({
  preload: false,
  fallback: ['system-ui'],
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const AuthLayout: React.FC<{ children: ReactNode; title: string }> = ({ children, title }) => {
  const { setTheme, theme } = useTheme();
  return (
    <>
      <Head>
        <title>EME</title>
      </Head>
      <div className={`${inter.className} py-8 min-h-screen flex items-center justify-center bg-base-300`}>
        <button
          className="absolute z-20 top-28 right-20 md:top-6 md:right-12"
          onClick={() => {
            theme === 'dark' ? setTheme('winter') : setTheme('dark');
          }}>
          {theme === 'dark' ? (
            <BsSun className="text-2xl transition-all hover:text-primary"></BsSun>
          ) : (
            <BsFillMoonFill className="text-xl transition-all hover:text-primary"></BsFillMoonFill>
          )}
        </button>
        <div className="card max-w-xs z-10 lg:max-w-none lg:w-[28rem] bg-base-100 shadow-xl">{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
