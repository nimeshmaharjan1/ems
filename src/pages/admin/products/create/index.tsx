import ImageUpload from '@/features/admin/components/image-upload';
import MainLayout from '@/features/admin/layouts/main';
import { IProductCreate, PRODUCT_CATEGORY } from '@/features/admin/products/interfaces';
import { NextPageWithLayout } from '@/pages/_app';
import FormControl from '@/shared/components/form-control';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import React, { ReactNode, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaRupeeSign } from 'react-icons/fa';

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
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<IProductCreate>({ defaultValues, mode: 'onChange' });
  const image = useWatch({
    control,
    name: 'image',
  });
  const upload = async (image: string | ArrayBuffer | null) => {
    if (!image) return;
    setIsUploading(true);
    try {
      const { data } = await axios.post('/api/upload-image', { image });
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
                  <option value="Hello">hello</option>
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
                    type="text"
                    pattern="[0-9]*"
                    placeholder="Type here"
                    {...register('price', {
                      required: 'Price is required.',
                    })}
                    onChange={(e) => {
                      if (!e.target.validity.valid) {
                        setError('price', { type: 'custom', message: 'Price should only contain numbers.' });
                      } else {
                        clearErrors('price');
                      }
                    }}
                    className={`input input-bordered w-full lg:max-w-[18.5rem] ${errors?.title ? 'input-error' : ''}`}
                  />
                </label>
              </FormControl>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Quantity" errorMessage={errors?.price?.message}>
                <input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="Type here"
                  {...register('price', {
                    required: 'Price is required.',
                  })}
                  onChange={(e) => {
                    if (!e.target.validity.valid) {
                      setError('price', { type: 'custom', message: 'Price should only contain numbers.' });
                    } else {
                      clearErrors('price');
                    }
                  }}
                  className={`input input-bordered w-full lg:max-w-[23rem] ${errors?.title ? 'input-error' : ''}`}
                />
              </FormControl>
            </div>
          </div>
          <div className="col-span-12">
            <button className="btn btn-primary btn-block">Submit</button>
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
  return <MainLayout>{page}</MainLayout>;
};
