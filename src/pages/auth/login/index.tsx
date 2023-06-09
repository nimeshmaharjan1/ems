import { ILoginWithPassword } from '@/features/auth/interfaces';
import AuthLayout from '@/features/auth/layout';
import { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import ErrorMessage from '@/shared/components/error-message';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { USER_ROLES } from '@prisma/client';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { FaGithub, FaUser } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './login.module.scss';
import { getCookie, setCookie } from 'cookies-next';

const Login: NextPageWithLayout = () => {
  const { data: session } = useSession();
  console.log({ session });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
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
      // console.log(getCookie('isFromCheckout'));
      // if (getCookie('isFromCheckout') === true) {
      //   setCookie('isFromCheckout', 'false');
      //   router.push('/checkout');
      // } else {
      router.push('/products');
      // }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      showToast(Toast.error, 'Something went wrong while trying to login please try again.');
    }
  };
  const handleLoginWithProviders = async (provider: any) => {
    setIsSubmitting(true);
    try {
      await signIn(provider);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (session) {
      setIsSubmitting(true);
      router.push('/products');
    }
  }, [session, router]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginWithPassword>({ defaultValues: { username: '', password: '' }, mode: 'onChange' });
  return (
    <div className="card-body">
      <h2 className="text-center text-lg lg:text-xl font-[800] tracking-wide mb-2 lg:mb-3">Login</h2>
      <p className="text-sm lg:text-lg text-center w-full mb-4">Hey, enter your details here to sign in to your account.</p>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('username', {
            required: 'username is required.',
          })}
          type="text"
          placeholder="Username"
          disabled={isSubmitting}
          autoComplete="off"
          className={classNames('input input-sm lg:input-md input-bordered w-full', {
            'input-error': errors?.username,
          })}
        />
        <ErrorMessage>{errors?.username?.message}</ErrorMessage>
        <FaUser
          className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
            'text-error': errors?.username,
          })}></FaUser>
      </div>
      <div className="form-control w-full mb-2 lg:mb-4 relative">
        <input
          {...register('password', {
            required: 'Password is required.',
          })}
          type={`${showPassword ? 'text' : 'password'}`}
          placeholder="Password"
          disabled={isSubmitting}
          autoComplete="off"
          className={classNames('input input-sm lg:input-md input-bordered w-full', {
            'input-error': errors?.password,
          })}
        />
        <ErrorMessage>{errors?.password?.message}</ErrorMessage>
        {showPassword ? (
          <FiEye
            className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3 cursor-pointer', {
              'text-error': errors?.password,
            })}
            onClick={() => setShowPassword((prev) => !prev)}></FiEye>
        ) : (
          <FiEyeOff
            className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
              'text-error': errors?.password,
            })}
            onClick={() => setShowPassword((prev) => !prev)}></FiEyeOff>
        )}
      </div>
      <button
        className={classNames('btn btn-primary btn-block lg:mb-1 btn-square gap-2')}
        disabled={isSubmitting}
        onClick={handleSubmit(handleLogin)}>
        {isSubmitting && <span className="loading loading-spinner"></span>}
        Sign In
      </button>
      <p className="text-[13px] font-light opacity-70 hover:opacity-100 cursor-pointer mt-2">Forgot password?</p>
      <p className={`text-center my-3 ${styles['or-sign-in']} text-xs md:text-md`}>Or Sign in with</p>
      <div className="card-actions justify-center !gap-3">
        <button
          className="btn  btn-xs lg:btn-md btn-outline  gap-2"
          disabled={isSubmitting}
          onClick={() => handleLoginWithProviders('google')}>
          <AiOutlineGoogle className="text-lg" />
          Google
        </button>
        <button
          className="btn btn-xs lg:btn-md btn-outline  gap-2"
          disabled={isSubmitting}
          onClick={() => handleLoginWithProviders('github')}>
          <FaGithub className="text-lg" />
          Github
        </button>
        {/* <button className="btn btn-outline  gap-2" disabled={isSubmitting}>
          <BsFacebook className="text-lg" />
          Facebook
        </button> */}
      </div>
      {!isSubmitting && (
        <p className="mt-3 text-xs lg:text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="cursor-pointer text-secondary hover:text-primary hover:underline duration-300">
            Register now
          </Link>
        </p>
      )}
    </div>
  );
};

export default Login;

Login.getLayout = (page: ReactNode) => <AuthLayout title="Sign In">{page}</AuthLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getServerSession(ctx.req, ctx.res, authOptions)) as any;
  if (session?.user?.role === USER_ROLES.ADMIN || session?.user?.role === USER_ROLES.SUPER_ADMIN) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: true,
      },
    };
  }
  if (session?.user?.role === USER_ROLES.USER) {
    return {
      redirect: {
        destination: '/products',
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};
