import ImageUpload from '@/features/admin/components/image-upload';
import MainLayout from '@/features/admin/layouts/main';
import { IProductCreate, PRODUCT_CATEGORY } from '@/features/admin/products/interfaces';
import { NextPageWithLayout } from '@/pages/_app';
import FormControl from '@/shared/components/form-control';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import React, { ReactNode, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

const CreateUser: NextPageWithLayout = () => {
  const defaultValues: IProductCreate = {
    category: PRODUCT_CATEGORY.LAPTOP,
    company: '',
    description: '',
    image: '',
    price: '',
    title: '',
  };
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
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
      <h2 className="font-semibold text-3xl">Add Products</h2>
      <div className="grid gap-x-12 grid-cols-1 md:grid-cols-12 my-6">
        <section className="col-span-6 flex flex-col gap-2">
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
