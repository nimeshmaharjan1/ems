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
import { PRODUCT_CATEGORY } from '@prisma/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const productSchema = z.object({
  category: z.enum([PRODUCT_CATEGORY.LAPTOP, PRODUCT_CATEGORY.MOBILE, PRODUCT_CATEGORY.TABLET]),
  title: z.string().min(1, { message: 'Product title is required.' }),
  company: z.string().min(1, { message: 'Company is required.' }),
  // image: z.string().optional(),
  images: z.array(z.string()).max(5, { message: 'Images cannot be more than five.' }).optional(),
  price: z.string().min(1, { message: 'Price is required.' }),
  quantity: z.string().min(1, { message: 'Quantity is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  slug: z.string().min(1, { message: 'Product slug is required.' }),
});
export type ProductSchema = z.infer<typeof productSchema>;

const CreateUser: NextPageWithLayout = () => {
  const defaultValues: ProductSchema = {
    category: PRODUCT_CATEGORY.LAPTOP,
    company: '',
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
    setError,
    clearErrors,
    getValues,
    handleSubmit,
  } = useForm<ProductSchema>({ mode: 'onChange', resolver: zodResolver(productSchema), defaultValues });
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const images = useWatch({
    control,
    name: 'images',
  });
  const upload = async (image: string | ArrayBuffer | null) => {
    if (!image) return;
    setIsUploading(true);
    try {
      const { data } = await axios.post('/api/upload-image', { image });
      setImageUrls((prev) => [...prev, data?.url]);
      setValue('images', [...(watch().images as string[]), data?.url]);
      showToast(Toast.success, data.message);
    } catch (e) {
      showToast(Toast.error, 'Something went wrong while trying to upload the image please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate: SubmitHandler<ProductSchema> = async (values) => {
    console.log(values);
    setIsSubmitting(true);
    try {
      await axios.post('/api/admin/products', { ...values, images: imageUrls });
      showToast(Toast.success, 'Product has been created.');
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
              <FormControl label="Category" errorMessage={errors?.category?.message as string}>
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
              <FormControl label="Company" errorMessage={errors?.company?.message as string}>
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
                  <option value="Apple">Apple</option>
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
                    className={`input input-bordered w-full lg:max-w-[18.5rem] ${errors?.price ? 'input-error' : ''}`}
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
                  className={`input input-bordered w-full lg:max-w-[23rem] ${errors?.quantity ? 'input-error' : ''}`}
                />
              </FormControl>
            </div>
          </div>
        </section>
        <section className="col-span-6">
          <FormControl label="Upload Product Image">
            <ImageUpload {...{ control }} initialImage={{ src: images?.[0] as string, alt: '' }} onChangePicture={upload} />
          </FormControl>

          <FormControl label="Product Slug" errorMessage={errors?.slug?.message as string}>
            <label className="input-group">
              <input
                type="text"
                placeholder="Type here"
                {...register('slug')}
                className={`input input-bordered w-full lg:max-w-[18.5rem] ${errors?.slug ? 'input-error' : ''}`}
              />
            </label>
          </FormControl>
        </section>

        <div className="col-span-6">
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
    </div>
  );
};

export default CreateUser;

CreateUser.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
