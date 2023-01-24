import React, { ReactNode, useState } from 'react';
import { AiOutlineMail, AiOutlineGoogle, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { BsFacebook } from 'react-icons/bs';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/features/auth/layout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { IRegister } from '@/features/auth/interfaces';
import classNames from 'classnames';
import ErrorMessage from '@/shared/components/error-message';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Toast, showToast } from '@/shared/utils/toast.util';

const Register: NextPageWithLayout = () => {
  const supabase = useSupabaseClient();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const formValues = {
    email: '',
    full_name: '',
    password: '',
    username: '',
  } as IRegister;
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegister>({ defaultValues: formValues, mode: 'onChange' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signUp = async (values: IRegister) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            username: values.username,
            phone_number: values.phone_number,
            role: 'super_admin',
          },
        },
      });
      if (error) {
        showToast(Toast.error, error?.message);
        return;
      }
      showToast(Toast.success, 'Check your email for the confirmation link.');
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="card-body">
      <h2 className="text-center text-3xl font-[800] tracking-wide mb-3">Register</h2>
      <p className="text-lg text-center w-full mb-4">Hey, enter your details here to create to your account.</p>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('full_name', {
            required: 'Full name is required.',
          })}
          type="text"
          placeholder="Full Name"
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.full_name,
          })}
        />
        <ErrorMessage>{errors?.full_name?.message}</ErrorMessage>
        <AiOutlineUser
          className={classNames('absolute right-4 text-primary text-xl top-3', {
            'text-error': errors?.full_name,
          })}
        ></AiOutlineUser>
      </div>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('username', {
            required: 'Username is required.',
          })}
          type="text"
          placeholder="Username"
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.username,
          })}
        />
        <ErrorMessage>{errors?.username?.message}</ErrorMessage>
        <AiOutlineUser
          className={classNames('absolute right-4 text-primary text-xl top-3', {
            'text-error': errors?.username,
          })}
        ></AiOutlineUser>
      </div>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('email', {
            required: 'Email is required.',
          })}
          type="email"
          placeholder="E-mail"
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.email,
          })}
        />
        <ErrorMessage>{errors?.email?.message}</ErrorMessage>
        <AiOutlineMail
          className={classNames('absolute right-4 text-primary text-xl top-3', {
            'text-error': errors?.email,
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
      <div className="form-control w-full mb-2 relative">
        <input
          type="phone"
          {...register('phone_number', {
            required: 'Phone Number is required.',
          })}
          placeholder="Phone Number"
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.phone_number,
          })}
        />
        <ErrorMessage>{errors?.phone_number?.message}</ErrorMessage>
        <AiOutlinePhone
          className={classNames('absolute right-4 text-primary text-xl top-3', {
            'text-error': errors?.phone_number,
          })}
        ></AiOutlinePhone>
      </div>
      <button
        className={classNames('btn btn-primary btn-block mt-3 my-2 btn-square gap-2', {
          loading: isSubmitting,
        })}
        disabled={isSubmitting}
        onClick={handleSubmit(signUp)}
      >
        Sign Up
      </button>

      <p className="text-sm text-center">
        Already have an account?{' '}
        <span
          className="cursor-pointer text-secondary hover:text-primary hover:underline duration-300"
          onClick={() => router.push('/auth/login')}
        >
          Sign In now
        </span>
      </p>
    </div>
  );
};

export default Register;

Register.getLayout = (page: ReactNode) => <AuthLayout title="Sign Up">{page}</AuthLayout>;
