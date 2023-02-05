import { useTheme } from 'next-themes';
import React, { ReactNode } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import Head from 'next/head';

const AuthLayout: React.FC<{ children: ReactNode; title: string }> = ({ children, title }) => {
  const { setTheme, theme } = useTheme();
  return (
    <>
      <Head>
        <title>EMS</title>
      </Head>
      <div className="h-screen flex items-center justify-center bg-base-300">
        <button
          className="absolute top-8 right-12"
          onClick={() => {
            theme === 'night' ? setTheme('light') : setTheme('night');
          }}
        >
          {theme === 'night' ? (
            <BsSun className="text-2xl hover:text-primary transition-all"></BsSun>
          ) : (
            <BsFillMoonFill className="text-xl hover:text-primary transition-all"></BsFillMoonFill>
          )}
        </button>
        <div className="card w-[28rem] bg-base-100 shadow-xl">{children}</div>
      </div>
    </>
  );
};

export default AuthLayout;
