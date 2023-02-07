import React, { ReactNode, useState } from 'react';
import { AiOutlineMail, AiOutlineGoogle } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { BsFacebook } from 'react-icons/bs';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './login.module.scss';
import { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/features/auth/layout';
import { useRouter } from 'next/router';
import { ILoginWithPassword } from '@/features/auth/interfaces';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { SubmitHandler, useForm } from 'react-hook-form';
import ErrorMessage from '@/shared/components/error-message';
import classNames from 'classnames';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSideProps } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { getRandomValues } from 'crypto';
import { USER_ROLES } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Login: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  console.log({ session });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin: SubmitHandler<ILoginWithPassword> = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', { ...values, redirect: false });
      if (response?.error) {
        showToast(Toast.error, response?.error);
        setIsSubmitting(false);
        return;
      }
      router.push('/products');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      showToast(Toast.error, 'Something went wrong while trying to login please try again.');
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginWithPassword>({ defaultValues: { username: '', password: '' }, mode: 'onChange' });

  return (
    <div className="card-body">
      <h2 className="text-center text-3xl font-[800] tracking-wide mb-3">Login</h2>
      <p className="text-lg text-center w-full mb-4">Hey, enter your details here to sign in to your account.</p>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('username', {
            required: 'username is required.',
          })}
          type="text"
          placeholder="Username"
          disabled={isSubmitting}
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.username,
          })}
        />
        <ErrorMessage>{errors?.username?.message}</ErrorMessage>
        <AiOutlineMail
          className={classNames('absolute right-4 text-primary text-xl top-3', {
            'text-error': errors?.username,
          })}
        ></AiOutlineMail>
      </div>
      <div className="form-control w-full mb-4 relative">
        <input
          {...register('password', {
            required: 'Password is required.',
          })}
          type={`${showPassword ? 'text' : 'password'}`}
          placeholder="Password"
          disabled={isSubmitting}
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.password,
          })}
        />
        <ErrorMessage>{errors?.password?.message}</ErrorMessage>
        {showPassword ? (
          <FiEye
            className={classNames('absolute right-4 text-primary text-xl top-3 cursor-pointer', {
              'text-error': errors?.password,
            })}
            onClick={() => setShowPassword((prev) => !prev)}
          ></FiEye>
        ) : (
          <FiEyeOff
            className={classNames('absolute right-4 text-primary text-xl top-3 cursor-pointer', {
              'text-error': errors?.password,
            })}
            onClick={() => setShowPassword((prev) => !prev)}
          ></FiEyeOff>
        )}
      </div>
      <button
        className={classNames('btn btn-primary btn-block mb-1 btn-square gap-2', {
          loading: isSubmitting,
        })}
        disabled={isSubmitting}
        onClick={handleSubmit(handleLogin)}
      >
        Sign In
      </button>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getServerSession(ctx.req, ctx.res, authOptions)) as any;
  if (session?.user?.role === USER_ROLES.ADMIN)
    return {
      redirect: {
        destination: '/admin/products',
        permanent: true,
      },
    };
  if (session?.user?.role === USER_ROLES.USER)
    return {
      redirect: {
        destination: '/products',
        permanent: true,
      },
    };
  return {
    props: {},
  };
};
