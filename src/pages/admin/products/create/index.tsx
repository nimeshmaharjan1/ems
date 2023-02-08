import ImageUpload from '@/features/admin/components/image-upload';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import FormControl from '@/shared/components/form-control';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { FaRupeeSign } from 'react-icons/fa';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CategoriesCard from '@/features/admin/categories/components/categories-card';
import CompaniesCard from '@/features/admin/companies/components/companies-card';
import { useQuery } from 'react-query';
import { Category, Company } from '@prisma/client';

const productSchema = z.object({
  categoryId: z.string().min(1, { message: 'Product category is required.' }),
  title: z.string().min(1, { message: 'Product title is required.' }),
  companyId: z.string().min(1, { message: 'Company is required.' }),
  images: z.array(z.string()).max(5, { message: 'Images cannot be more than five.' }).optional(),
  price: z.string().min(1, { message: 'Price is required.' }),
  quantity: z.string().min(1, { message: 'Quantity is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  slug: z.string().min(1, { message: 'Product slug is required.' }),
});
export type ProductSchema = z.infer<typeof productSchema>;

const CreateUser: NextPageWithLayout = () => {
  const defaultValues: ProductSchema = {
    categoryId: '',
    companyId: '',
    description: '',
    images: [],
    price: '',
    title: '',
    quantity: '',
    slug: '',
  };
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ProductSchema>({ mode: 'onChange', resolver: zodResolver(productSchema), defaultValues });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const images = useWatch({
    control,
    name: 'images',
  });
  const upload = async (images: (string | ArrayBuffer | null)[]) => {
    const filteredImages = images.filter((image) => image !== null);
    if (filteredImages.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = filteredImages.map((image) => axios.post('/api/upload-image', { image }));
      const responses = await Promise.all(uploadPromises);
      const urls = responses.map((response) => response.data.url);
      setValue('images', [...(watch().images as string[]), ...urls]);
      showToast(Toast.success, 'All images uploaded successfully.');
    } catch (e) {
      showToast(Toast.error, 'Something went wrong while trying to upload the images please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const [resetImages, setResetImages] = useState(false);
  const handleCreate: SubmitHandler<ProductSchema> = async (values) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/admin/products', { ...values });
      showToast(Toast.success, 'Product has been created.');
      reset();
      setResetImages(true);
    } catch (error) {
      showToast(Toast.error, 'Something went wrong please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    data: categories,
    isError: categoryError,
    isLoading: isCategoryLoading,
  } = useQuery<Category[], Error>('fetchCategories', async () => {
    const response = await axios.get('/api/admin/categories');
    return response.data.categories;
  });

  const {
    data: companies,
    isError: companyError,
    isLoading: isCompanyLoading,
  } = useQuery<Company[], Error>('fetchCompanies', async () => {
    const response = await axios.get('/api/admin/companies');
    return response.data.companies;
  });

  return (
    <div className="min-h-screen">
      <h2 className="font-semibold text-3xl ">Add Products</h2>
      <div className="grid gap-x-12 grid-cols-6 my-6">
        <section className="col-span-6 lg:col-span-3 flex flex-col gap-1">
          <FormControl label="Product Name" errorMessage={errors?.title?.message as string}>
            <input
              type="text"
              placeholder="Type here"
              {...register('title')}
              className={`input input-bordered w-full max-w-3xl ${errors?.title ? 'input-error' : ''}`}
            />
          </FormControl>

          <FormControl label="Description" errorMessage={errors?.description?.message as string}>
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
              <FormControl label="Category" errorMessage={errors?.categoryId?.message as string}>
                <select
                  disabled={isCategoryLoading}
                  placeholder="Type here"
                  {...register('categoryId', {
                    required: 'Category is required.',
                  })}
                  className={`select select-bordered w-full lg:max-w-[24rem] ${errors?.description ? 'input-error' : ''}`}
                >
                  <option value="" defaultChecked>
                    Select Category
                  </option>
                  {categories?.map((category) => {
                    return <option key={category.id}>{category.name}</option>;
                  })}
                </select>
              </FormControl>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Company" errorMessage={errors?.companyId?.message as string}>
                <select
                  disabled={isCompanyLoading}
                  placeholder="Type here"
                  {...register('companyId', {
                    required: 'Company is required.',
                  })}
                  className={`select select-bordered w-full ${errors?.description ? 'input-error' : ''}`}
                >
                  <option value="" defaultChecked>
                    Select company
                  </option>
                  {companies?.map((company) => {
                    return <option key={company.id}>{company.name}</option>;
                  })}
                </select>
              </FormControl>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-x-2">
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Price" errorMessage={errors?.price?.message as string}>
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
                    className={`input input-bordered w-full ${errors?.price ? 'input-error' : ''}`}
                  />
                </label>
              </FormControl>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormControl label="Quantity" errorMessage={errors?.quantity?.message as string}>
                <input
                  type="text"
                  pattern="[0-9]*"
                  placeholder="Type here"
                  {...register('quantity', {
                    required: 'Quantity is required.',
                  })}
                  className={`input input-bordered w-full ${errors?.quantity ? 'input-error' : ''}`}
                />
              </FormControl>
            </div>
          </div>
        </section>
        <section className="col-span-6 lg:col-span-3 grid grid-cols-6 gap-x-12">
          <div className="image-section col-span-6 lg:col-span-3">
            <FormControl label="Upload Product Image">
              <ImageUpload {...{ control, resetImages }} initialImage={{ src: images?.[0] as string, alt: '' }} onChangePicture={upload} />
            </FormControl>

            <FormControl label="Product Slug" errorMessage={errors?.slug?.message as string}>
              <input
                type="text"
                placeholder="Type here"
                {...register('slug')}
                className={`input input-bordered w-full  ${errors?.slug ? 'input-error' : ''}`}
              />
            </FormControl>
          </div>
          <section className="labels-section col-span-6 lg:col-span-3 flex flex-col lg:mt-3.5">
            <CategoriesCard></CategoriesCard>
            <div className="divider"></div>
            <CompaniesCard></CompaniesCard>
          </section>
        </section>
      </div>

      <div>
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
    </div>
  );
};

export default CreateUser;

CreateUser.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
