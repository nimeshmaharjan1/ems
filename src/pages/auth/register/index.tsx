import React, { ReactNode, useState } from 'react';
import { AiOutlineMail, AiOutlineGoogle, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/features/auth/layout';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegister } from '@/features/auth/interfaces';
import classNames from 'classnames';
import ErrorMessage from '@/shared/components/error-message';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios, { AxiosError } from 'axios';
import { USER_ROLES } from '@prisma/client';
import { RxLetterCaseCapitalize } from 'react-icons/rx';
import { emailPattern, phonePattern } from '@/shared/utils/pattern.util';
import { useSession } from 'next-auth/react';

const Register: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const formValues = {
    email: '',
    password: '',
    username: '',
    name: '',
    phone_number: '',
    role: USER_ROLES.USER,
  } as IRegister;
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegister>({ defaultValues: formValues, mode: 'onSubmit' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUp: SubmitHandler<IRegister> = async (values) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/auth/register', { ...values, role: USER_ROLES.SUPER_ADMIN });
      showToast(Toast.success, 'User has been successfully created.');
      router.push('/api/auth/signin');
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
      if (error?.response?.data?.message) {
        return showToast(Toast.error, error.response.data.message);
      }
      showToast(Toast.error, 'Something went wrong while trying to create the user.');
    }
  };

  return (
    <div className="card-body">
      <h2 className="text-center text-3xl font-[800] tracking-wide mb-3">Register</h2>
      <p className="text-lg text-center w-full mb-4">Hey, enter your details here to create to your account.</p>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('name', {
            required: 'Full name is required.',
          })}
          type="text"
          disabled={isSubmitting}
          placeholder="Full Name"
          autoComplete="off"
          className={classNames('input input-bordered w-full', {
            'input-error': errors?.name,
          })}
        />
        <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        <RxLetterCaseCapitalize
          className={classNames('absolute right-4 text-primary text-xl top-3', {
            'text-error': errors?.name,
          })}
        ></RxLetterCaseCapitalize>
      </div>
      <div className="form-control w-full mb-2 relative">
        <input
          {...register('username', {
            required: 'Username is required.',
          })}
          type="text"
          disabled={isSubmitting}
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
            validate: {
              checkEmailFormat: (value) => emailPattern.test(value) || 'Invalid email address format.',
            },
          })}
          type="email"
          disabled={isSubmitting}
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
      <div className="form-control w-full mb-2 relative">
        <input
          type="phone"
          {...register('phone_number', {
            required: 'Phone Number is required.',
            validate: {
              checkEmailFormat: (value) => phonePattern.test(value) || 'Invalid phone number.',
            },
          })}
          placeholder="Phone Number"
          disabled={isSubmitting}
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
      {session?.user?.role === USER_ROLES.SUPER_ADMIN && (
        <select className="select select-bordered w-full" {...register('role')} disabled={isSubmitting}>
          <option disabled selected>
            Select Role
          </option>
          <option value={USER_ROLES.USER}>User</option>
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.ADMIN}>Super Admin</option>
        </select>
      )}
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
          onClick={() => router.push('/api/auth/signin')}
        >
          Sign In now
        </span>
      </p>
    </div>
  );
};

export default Register;

Register.getLayout = (page: ReactNode) => <AuthLayout title="Sign Up">{page}</AuthLayout>;
