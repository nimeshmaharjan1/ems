import { useTheme } from 'next-themes';
import React, { ReactNode, useState } from 'react';
import { AiOutlineMail, AiOutlineGoogle } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { BsFacebook, BsFillMoonFill, BsSun } from 'react-icons/bs';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Head from 'next/head';

const AuthLayout: React.FC<{ children: ReactNode; title: string }> = ({ children, title }) => {
  const { setTheme, theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Head>
        <title>{title} - EMS</title>
      </Head>
      <div className="h-screen flex items-center justify-center bg-base-300">
        <button
          className="absolute top-8 right-24"
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
