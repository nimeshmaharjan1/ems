import ImageUpload from '@/features/admin/components/image-upload';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import { IProductCreate } from '@/features/admin/products/interfaces';
import { NextPageWithLayout } from '@/pages/_app';
import FormControl from '@/shared/components/form-control';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaRupeeSign } from 'react-icons/fa';
import { PRODUCT_CATEGORY } from '@prisma/client';

const CreateUser: NextPageWithLayout = () => {
  const defaultValues: IProductCreate = {
    category: PRODUCT_CATEGORY.LAPTOP,
    company: '',
    description: '',
    image: '',
    price: '',
    title: '',
    quantity: null,
  };
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<IProductCreate>({ defaultValues, mode: 'onChange' });
  const image = useWatch({
    control,
    name: 'image',
  });
  const upload = async (image: string | ArrayBuffer | null) => {
    if (!image) return;
    setIsUploading(true);
    try {
      const { data } = await axios.post('/api/upload-image', { image, category: watch('category') });
      setImageUrl(data?.url);
      setValue('image', data?.url);
      showToast(Toast.success, data.message);
    } catch (e) {
      showToast(Toast.error, 'Something went wrong while trying to upload the image please try again.');
      setImageUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (values: IProductCreate) => {
    setIsSubmitting(true);
    try {
      const product = await axios.post('/api/admin/products', values);
      console.log(product);
    } catch (error) {
      console.log(error);
      showToast(Toast.error, 'Something went wrong please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen">
      <h2 className="font-semibold text-3xl ">Add Products</h2>
      <div className="grid gap-x-12 grid-cols-1 md:grid-cols-12 my-6">
        <section className="col-span-6 flex flex-col gap-1">
          <FormControl label="Product Name" errorMessage={errors?.title?.message}>
            <input
              type="text"
              placeholder="Type here"
              {...register('title', {
                required: 'Product name is required.',
                minLength: {
                  value: 2,
                  message: 'Product name must be above 2 characters.',
                },
                maxLength: {
                  value: 100,
                  message: 'Product name must be below 100 characters.',
                },
              })}
              className={`input input-bordered w-full max-w-3xl ${errors?.title ? 'input-error' : ''}`}
            />
          </FormControl>

          <FormControl label="Description" errorMessage={errors?.description?.message}>
            <textarea
              placeholder="Type here"
              {...register('description', {
                required: 'Description is required.',
                minLength: {
                  value: 2,
                  message: 'Description must be above 2 characters.',
                },
                maxLength: {
                  value: 100,
                  message: 'Description must be below 255 characters.',
                },
              })}
              rows={6}
              className={`textarea textarea-bordered w-full max-w-3xl ${errors?.description ? 'textarea-error' : ''}`}
            />
          </FormControl>
          <div className="grid grid-cols-12 gap-x-2 lg:gap-x-2">
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Category" errorMessage={errors?.category?.message}>
                <select
                  placeholder="Type here"
                  {...register('category', {
                    required: 'Category is required.',
                  })}
                  className={`select select-bordered w-full lg:max-w-[24rem] ${errors?.description ? 'input-error' : ''}`}
                >
                  <option value={PRODUCT_CATEGORY.LAPTOP} defaultChecked>
                    Laptop
                  </option>
                </select>
              </FormControl>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Company" errorMessage={errors?.company?.message}>
                <select
                  placeholder="Type here"
                  {...register('company', {
                    required: 'Company is required.',
                  })}
                  className={`select select-bordered w-full lg:max-w-[22rem] ${errors?.description ? 'input-error' : ''}`}
                >
                  <option value="" defaultChecked>
                    Select company
                  </option>
                  <option value="Acer">Acer</option>
                  <option value="Asus">Asus</option>
                </select>
              </FormControl>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Price" errorMessage={errors?.price?.message}>
                <label className="input-group">
                  <span>
                    <FaRupeeSign />
                  </span>
                  <input
                    type="number"
                    pattern="[0-9]*"
                    placeholder="Type here"
                    {...register('price', {
                      required: 'Price is required.',
                    })}
                    className={`input input-bordered w-full lg:max-w-[18.5rem] ${errors?.price ? 'input-error' : ''}`}
                  />
                </label>
              </FormControl>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Quantity" errorMessage={errors?.quantity?.message}>
                <input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="Type here"
                  {...register('quantity', {
                    required: 'Quantity is required.',
                  })}
                  className={`input input-bordered w-full lg:max-w-[23rem] ${errors?.quantity ? 'input-error' : ''}`}
                />
              </FormControl>
            </div>
          </div>
          <div className="col-span-12">
            <button
              className={classNames('btn btn-primary btn-block', {
                loading: isSubmitting,
              })}
              disabled={isSubmitting || isUploading}
              onClick={handleSubmit(handleCreate)}
            >
              Submit
            </button>
          </div>
        </section>
        <section className="col-span-6">
          <FormControl label="Upload Product Image">
            <ImageUpload {...{ control }} initialImage={{ src: image, alt: 'Product Image' }} onChangePicture={upload} />
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default CreateUser;

CreateUser.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
