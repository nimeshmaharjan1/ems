import React, { ReactNode, useState } from 'react';
import { AiOutlineMail, AiOutlineGoogle } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { BsFacebook } from 'react-icons/bs';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './login.module.scss';
import { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/features/auth/layout';
import { useRouter } from 'next/router';
const Login: NextPageWithLayout = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <div className="card-body">
      <h2 className="text-center text-3xl font-[800] tracking-wide mb-3">Login</h2>
      <p className="text-lg text-center w-full mb-4">Hey, enter your details here to sign in to your account.</p>
      <div className="form-control w-full mb-2 relative">
        <input type="email" placeholder="E-mail" autoComplete="off" className="input input-bordered w-full " />
        <AiOutlineMail className="absolute right-4 text-primary text-xl top-3"></AiOutlineMail>
      </div>
      <div className="form-control w-full mb-4 relative">
        <input
          type={`${showPassword ? 'text' : 'password'}`}
          placeholder="Password"
          autoComplete="off"
          className="input input-bordered w-full "
        />
        {showPassword ? (
          <FiEye
            className="absolute right-4 text-primary text-xl top-3 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          ></FiEye>
        ) : (
          <FiEyeOff
            className="absolute right-4 text-primary text-xl top-3 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          ></FiEyeOff>
        )}
      </div>
      <button className="btn btn-primary btn-block mb-1 btn-square">Sign In</button>
      <p className="text-[13px] font-light opacity-70 hover:opacity-100 cursor-pointer">Forgot password?</p>
      <p className={`text-center my-3 ${styles['or-sign-in']}`}>Or Sign in with</p>
      <div className="card-actions justify-center !gap-3">
        <button className="btn !normal-case gap-2 hover:text-primary">
          <AiOutlineGoogle className="text-lg" />
          Google
        </button>
        <button className="btn !normal-case gap-2 hover:text-primary">
          <FaDiscord className="text-lg" />
          Discord
        </button>
        <button className="btn !normal-case gap-2 hover:text-primary">
          <BsFacebook className="text-lg" />
          Facebook
        </button>
      </div>
      <p className="mt-3 text-sm text-center">
        Don&apos;t have an account?{' '}
        <span
          className="cursor-pointer text-secondary hover:text-primary hover:underline duration-300"
          onClick={() => router.push('/auth/register')}
        >
          Register now
        </span>
      </p>
    </div>
  );
};

export default Login;

Login.getLayout = (page: ReactNode) => <AuthLayout title="Sign In">{page}</AuthLayout>;
