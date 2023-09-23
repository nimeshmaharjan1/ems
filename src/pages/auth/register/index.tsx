import React, { ReactNode, useState } from 'react';
import { AiOutlineMail, AiOutlineGoogle, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/features/auth/layout';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { IRegister } from '@/features/auth/interfaces';
import classNames from 'classnames';
import ErrorMessage from '@/shared/components/error-message';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { USER_ROLES, User } from '@prisma/client';
import { RxLetterCaseCapitalize } from 'react-icons/rx';
import { emailPattern, phonePattern } from '@/shared/utils/pattern.util';
import { signIn, useSession } from 'next-auth/react';
import { Hash, Store } from 'lucide-react';

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
    applyingAsBusinessClient: false,
    shopAddress: '',
    taxId: '',
  } as IRegister;
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IRegister>({ defaultValues: formValues, mode: 'onSubmit' });

  const { applyingAsBusinessClient } = useWatch({
    control,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUp: SubmitHandler<IRegister> = async (values) => {
    setIsSubmitting(true);
    // const response: AxiosResponse<{ user: User; message: string }> =

    axios
      .post('/api/auth/register', values)
      .then((response: AxiosResponse<{ user: User; message: string }>) => {
        console.log('response here: ', response.data.user);

        axios
          .post('/api/email/register', {
            user: response.data.user,
          })
          .then(() => {
            showToast(Toast.success, 'Your account has been registered please login.');
            signIn();
          })
          .catch((error) => console.log('email error: ', error));
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
        if (error?.response?.data?.message) {
          return showToast(Toast.error, error.response.data.message);
        }
        showToast(Toast.error, 'Something went wrong while trying to create the user.');
      });
  };

  return (
    <div className="card-body">
      <h2 className="text-center text-lg lg:text-2xl font-[800] tracking-wide mb-2 lg:mb-3">Register</h2>
      <p className="w-full mb-4 text-sm text-center lg:text-base">Hey, enter your details here to create to your account.</p>
      <div className="relative w-full mb-0 form-control lg:mb-0">
        <input
          {...register('name', {
            required: 'Full name is required.',
          })}
          type="text"
          disabled={isSubmitting}
          placeholder="Full Name"
          autoComplete="off"
          className={classNames('input input-md input-bordered w-full', {
            'input-error': errors?.name,
          })}
        />
        <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        <RxLetterCaseCapitalize
          className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
            'text-error': errors?.name,
          })}></RxLetterCaseCapitalize>
      </div>
      <div className="relative w-full mb-0 form-control lg:mb-0">
        <input
          {...register('username', {
            required: 'Username is required.',
          })}
          type="text"
          disabled={isSubmitting}
          placeholder="Username"
          autoComplete="off"
          className={classNames('input input-md input-bordered w-full', {
            'input-error': errors?.username,
          })}
        />
        <ErrorMessage>{errors?.username?.message}</ErrorMessage>
        <AiOutlineUser
          className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
            'text-error': errors?.username,
          })}></AiOutlineUser>
      </div>
      <div className="relative w-full mb-0 form-control lg:mb-0">
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
          className={classNames('input input-md input-bordered w-full', {
            'input-error': errors?.email,
          })}
        />
        <ErrorMessage>{errors?.email?.message}</ErrorMessage>
        <AiOutlineMail
          className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
            'text-error': errors?.email,
          })}></AiOutlineMail>
      </div>
      <div className="relative w-full form-control lg:mb-0">
        <input
          {...register('password', {
            required: 'Password is required.',
          })}
          type={`${showPassword ? 'text' : 'password'}`}
          placeholder="Password"
          disabled={isSubmitting}
          autoComplete="off"
          className={classNames('input input-md input-bordered w-full', {
            'input-error': errors?.password,
          })}
        />
        <ErrorMessage>{errors?.password?.message}</ErrorMessage>
        {showPassword ? (
          <FiEye
            className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
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
      <div className="relative w-full mb-0 form-control lg:mb-0">
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
          className={classNames('input input-md input-bordered w-full', {
            'input-error': errors?.phone_number,
          })}
        />
        <ErrorMessage>{errors?.phone_number?.message}</ErrorMessage>
        <AiOutlinePhone
          className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
            'text-error': errors?.phone_number,
          })}></AiOutlinePhone>
      </div>
      {session?.user?.role === USER_ROLES.SUPER_ADMIN && (
        <select className="w-full select select-bordered" {...register('role')} disabled={isSubmitting}>
          <option disabled selected>
            Select Role
          </option>
          <option value={USER_ROLES.USER}>User</option>
          <option value={USER_ROLES.STAFF}>Admin</option>
          <option value={USER_ROLES.STAFF}>Super Admin</option>
        </select>
      )}
      <div className="form-control">
        <label className="!justify-start gap-3 cursor-pointer label">
          <input type="checkbox" {...register('applyingAsBusinessClient')} className="checkbox checkbox-sm checkbox-primary" />
          <span className="label-text">Register as a business client</span>
        </label>
      </div>
      {applyingAsBusinessClient && (
        <>
          <div className="relative w-full mt-1 mb-0 form-control lg:mb-0">
            <input
              {...register('taxId', {
                required: {
                  value: applyingAsBusinessClient,
                  message: 'Tax ID is required.',
                },
              })}
              type="text"
              disabled={isSubmitting}
              placeholder="Tax ID"
              autoComplete="off"
              className={classNames('input input-md input-bordered w-full', {
                'input-error': errors?.taxId,
              })}
            />
            <ErrorMessage>{errors?.taxId?.message}</ErrorMessage>
            <Hash
              strokeWidth={1.25}
              className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
                'text-error': errors?.taxId,
              })}></Hash>
          </div>
          <div className="relative w-full mt-1 mb-0 form-control lg:mb-0">
            <input
              {...register('shopAddress', {
                required: {
                  value: applyingAsBusinessClient,
                  message: 'Shop address is required.',
                },
              })}
              type="text"
              disabled={isSubmitting}
              placeholder="Shop Address"
              autoComplete="off"
              className={classNames('input input-md input-bordered w-full', {
                'input-error': errors?.shopAddress,
              })}
            />
            <ErrorMessage>{errors?.shopAddress?.message}</ErrorMessage>
            <Store
              strokeWidth={1.25}
              className={classNames('absolute right-4 text-primary text-sm lg:text-xl top-2 lg:top-3', {
                'text-error': errors?.shopAddress,
              })}></Store>
          </div>
        </>
      )}
      <button
        className={classNames('btn btn-primary btn-block lg:mt-2 mt-0 my-2 btn-square gap-2')}
        disabled={isSubmitting}
        onClick={handleSubmit(signUp)}>
        {isSubmitting && <span className="loading loading-spinner"></span>}
        Sign Up
      </button>

      <div className="flex flex-col-reverse lg:flex-row items-start gap-y-4 lg:gap-y-0 lg:items-center justify-between px-2">
        <p className="text-sm">
          <span className="link" onClick={() => router.back()}>
            Go Back
          </span>
        </p>
        <p className="text-sm text-right">
          Already have an account?{' '}
          <span className="duration-300 cursor-pointer text-secondary hover:text-primary hover:underline" onClick={() => signIn()}>
            Sign In now
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

Register.getLayout = (page: ReactNode) => <AuthLayout title="Sign Up">{page}</AuthLayout>;
