import ImageUpload from '@/features/admin/components/image-upload';
import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import FormControl from '@/shared/components/form-control';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { FaRupeeSign } from 'react-icons/fa';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'react-query';
import { Category, Company, PrismaClient } from '@prisma/client';
import { getCompanies } from '@/features/admin/services/companies/companies.service';
import StyledReactSelect from '@/shared/components/styled-react-select';
import { getCategories } from '@/features/admin/services/categories/categories.service';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
// import TextEditor from '@/shared/components/text-editor';

const TextEditor = dynamic(() => import('../../../../shared/components/text-editor/index' as any), {
  ssr: false,
}) as any;

const prisma = new PrismaClient();

/**
 * @author Nimesh Maharjan
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context?.params?.productId as string;
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true, company: true } });
    const reactSelectCompany = {
      label: product?.company.name,
      value: product?.company.id,
    };
    const reactSelectCategory = {
      label: product?.category.name,
      value: product?.category.id,
    };
    return {
      props: {
        product: JSON.parse(
          JSON.stringify({ ...product, price: product?.price.toString(), company: reactSelectCompany, category: reactSelectCategory })
        ),
      },
    };
  } catch (error) {
    console.error('error: ', error);
  }
  return {
    props: {
      product: null,
    },
  };
};

const productSchema = z
  .object({
    // categoryId: z.string().min(1, { message: 'Product category is required.' }),
    title: z.string().min(1, { message: 'Product title is required.' }),
    modal: z.string().min(1, { message: 'Modal is required.' }),
    company: z.object({
      label: z.string().min(1, { message: 'Company is required.' }),
      value: z.string().min(1, { message: 'Company is required.' }),
    }),
    category: z.object({
      label: z.string().min(1, { message: 'Category is required.' }),
      value: z.string().min(1, { message: 'Category is required.' }),
    }),
    images: z.array(z.string()).max(5, { message: 'Images cannot be more than five.' }).optional(),
    price: z.string().min(1, { message: 'Price is required.' }),
    quantity: z.string().min(1, { message: 'Quantity is required.' }),
    description: z.string().min(1, { message: 'Description is required.' }),
    slug: z.string().min(1, { message: 'Product slug is required.' }),
    hasOffer: z.boolean(),
    discountPercentage: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.hasOffer) {
      if (!values.discountPercentage) {
        ctx.addIssue({
          message: 'Discount percentage is required.',
          code: z.ZodIssueCode.custom,
          path: ['discountPercentage'],
        });
      } else if (values.discountPercentage && !/^[1-9][0-9]?$/.test(values.discountPercentage)) {
        ctx.addIssue({
          message: 'Discount percentage must be between 1 and 99.',
          code: z.ZodIssueCode.custom,
          path: ['discountPercentage'],
        });
      }
    }
  });
export type ProductSchema = z.infer<typeof productSchema>;

const EditProduct: NextPageWithLayout<{ product: any }> = ({ product }) => {
  const defaultValues: ProductSchema = product;
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
  }) as any;
  const upload = async (images: (string | ArrayBuffer | null)[]) => {
    const filteredImages = images.filter((image) => image !== null);
    if (filteredImages.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = filteredImages.map((image) => axios.post('/api/image-upload', { image }));
      const responses = await Promise.all(uploadPromises);
      const urls = responses.map((response) => response.data.url);
      setValue('images', [...(watch().images as string[]), ...urls]);
      showToast(Toast.success, 'All images uploaded successfully.');
    } catch (e: any) {
      console.error(e.response);
      if (typeof e.response?.data === 'string') {
        showToast(Toast.error, e.response?.data);
      } else {
        showToast(Toast.error, 'Something went wrong while trying to upload the images please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };
  const router = useRouter();
  const [resetImages, setResetImages] = useState(false);
  const handleUpdate: SubmitHandler<ProductSchema> = async (values) => {
    setIsSubmitting(true);

    try {
      await axios.put(`/api/admin/products/${product.id}`, { ...values });
      showToast(Toast.success, 'Product has been updated.');
      reset();
      setResetImages(true);
      router.push('/admin/products');
    } catch (error) {
      setIsSubmitting(false);

      showToast(Toast.error, 'Something went wrong please try again.');
    }
  };

  const loadCategories = async (searchValue: string, loadedData: any, { page }: any) => {
    try {
      const companyData = await getCategories({ page, limit: 5 });
      let filteredOptions: any;
      if (!searchValue) {
        filteredOptions = companyData.data;
      } else {
        filteredOptions = companyData.data.filter((option: any) => option.name.toLowerCase().includes(searchValue.toLowerCase()));
      }
      return {
        options: filteredOptions.map((option: any) => {
          return {
            value: option.id,
            label: option.name,
          };
        }),
        hasMore: companyData.page < companyData.totalPages ? true : false,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadCompanies = async (searchValue: string, loadedData: any, { page }: any) => {
    try {
      const companyData = await getCompanies({ page, limit: 5 });
      let filteredOptions: any;
      if (!searchValue) {
        filteredOptions = companyData.data;
      } else {
        filteredOptions = companyData.data.filter((option: any) => option.name.toLowerCase().includes(searchValue.toLowerCase()));
      }
      return {
        options: filteredOptions.map((option: any) => {
          return {
            value: option.id,
            label: option.name,
          };
        }),
        hasMore: companyData.page < companyData.totalPages ? true : false,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-semibold ">Edit Product</h2>
      <div className="grid grid-cols-6 my-6 gap-x-12">
        <section className="flex flex-col col-span-6 gap-y-2 lg:col-span-3">
          <FormControl label="Product Name" errorMessage={errors?.title?.message as string}>
            <input
              type="text"
              placeholder="Type here"
              {...register('title')}
              className={`input input-bordered w-full max-w-3xl ${errors?.title ? 'input-error' : ''}`}
            />
          </FormControl>
          <FormControl label="Modal" errorMessage={errors?.modal?.message as string}>
            <input
              type="text"
              placeholder="Type here"
              {...register('modal')}
              className={`input input-bordered w-full max-w-3xl ${errors?.modal ? 'input-error' : ''}`}
            />
          </FormControl>

          <Controller
            rules={{
              required: 'Description is required.',
            }}
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => (
              <FormControl label="Description" errorMessage={errors?.description?.message as string}>
                <TextEditor onChange={onChange} isInvalid={invalid} ref={ref} value={value}></TextEditor>
                {/* 
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
            /> */}
              </FormControl>
            )}
          />
          <div className="grid grid-cols-12 gap-x-2 gap-y-3 lg:gap-x-2">
            <div className="col-span-12 lg:col-span-6">
              <Controller
                control={control}
                name="company"
                render={({ field: { onChange, value, name }, fieldState: { error } }) => {
                  const err = error as any;
                  return (
                    <FormControl label="Company" errorMessage={err?.value?.message}>
                      <StyledReactSelect
                        {...{ onChange, value, name }}
                        isRequired={err?.value?.message ? true : false}
                        placeholder={'Select company'}
                        loadOptions={loadCompanies}></StyledReactSelect>
                    </FormControl>
                  );
                }}></Controller>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value, name }, fieldState: { error } }) => {
                  const err = error as any;
                  return (
                    <FormControl label="Category" errorMessage={err?.value?.message}>
                      <StyledReactSelect
                        {...{ onChange, value, name }}
                        isRequired={err?.value?.message ? true : false}
                        placeholder={'Select category'}
                        loadOptions={loadCategories}></StyledReactSelect>
                    </FormControl>
                  );
                }}></Controller>
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
                    type="text"
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
          <div className="grid grid-cols-6 my-2">
            <div className="col-span-6 form-control">
              <label className="cursor-pointer label !justify-start gap-x-3">
                <span className="!text-base">Apply Offer</span>
                <input
                  type="checkbox"
                  {...register('hasOffer', {
                    onChange: () => setValue('discountPercentage', ''),
                  })}
                  className="toggle"
                />
              </label>
            </div>
            <div className="col-span-6 mt-1">
              <FormControl errorMessage={errors?.discountPercentage?.message as string}>
                <input
                  type="text"
                  disabled={!watch('hasOffer')}
                  placeholder="Type discount percentage here"
                  {...register('discountPercentage')}
                  className={`input input-bordered w-full  ${errors?.discountPercentage ? 'input-error' : ''}`}
                />
              </FormControl>
            </div>
          </div>

          <div className="hidden col-span-12 mt-4 lg:block">
            <button
              className={classNames('btn btn-primary btn-block')}
              disabled={isSubmitting || isUploading}
              onClick={handleSubmit(handleUpdate)}>
              {isSubmitting && <span className="loading loading-spinner"></span>}
              Submit
            </button>
          </div>
        </section>
        <section className="grid grid-cols-6 col-span-6 lg:col-span-3 gap-x-12">
          <div className="col-span-6 mt-4 image-section lg:col-span-6 lg:mt-0">
            <FormControl label="Upload Product Image">
              <ImageUpload
                {...{ control, resetImages, setResetImages }}
                initialImage={images?.map((image: any) => ({ src: image as string, alt: '' }))}
                onChangePicture={upload}
              />
            </FormControl>

            <FormControl label="Product Slug" className="lg:mt-3" errorMessage={errors?.slug?.message as string}>
              <input
                type="text"
                placeholder="Type here"
                {...register('slug')}
                className={`input input-bordered w-full  ${errors?.slug ? 'input-error' : ''}`}
              />
            </FormControl>
          </div>
          {/* <section className="labels-section col-span-6 lg:col-span-3 flex flex-col lg:mt-3.5">
            <CategoriesCard></CategoriesCard>
            <div className="divider"></div>
            <CompaniesCard></CompaniesCard>
          </section> */}
        </section>
      </div>
      <div className="block lg:hidden">
        <button
          className={classNames('btn btn-primary btn-block')}
          disabled={isSubmitting || isUploading}
          onClick={handleSubmit(handleUpdate)}>
          {isSubmitting && <span className="loading loading-spinner"></span>}
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditProduct;

EditProduct.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
