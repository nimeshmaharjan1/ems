import { ProductSchema } from '@/pages/admin/products/create';
import { Product } from '@prisma/client';
import classNames from 'classnames';
import Image from 'next/legacy/image';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { AiOutlineArrowUp } from 'react-icons/ai';
interface Props {
  label?: string;
  initialImage: any;
  accept?: string;
  sizeLimit?: number;
  onChangePicture: (images: any) => void;
  control: Control<ProductSchema>;
  resetImages: boolean;
  setResetImages: Dispatch<SetStateAction<boolean>>;
}

const ImageUpload: React.FC<Props> = ({
  label = 'Image',
  initialImage,
  accept = '.png, .jpg, .jpeg, .gif',
  sizeLimit = 10 * 1024 * 1024, // 10MB
  onChangePicture,
  control,
  resetImages,
  setResetImages,
}) => {
  const imageRef = React.useRef<HTMLInputElement>(null);
  const [images, setImages] = React.useState<any>(!initialImage?.length ? [initialImage] : [...initialImage]);
  const [updatingImage, setUpdatingImage] = React.useState(false);
  const [imageError, setPictureError] = React.useState('');
  const handleOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUpdatingImage(true);
    setPictureError('');

    const filteredFiles = Array.from(files).filter((file) => file.size <= sizeLimit);
    const invalidFiles = Array.from(files).filter((file) => file.size > sizeLimit);
    if (invalidFiles.length > 0) {
      setPictureError('Some file sizes are exceeding 10MB.');
      return;
    }

    const readerPromises = filteredFiles.map((file) => {
      const reader = new FileReader();
      const fileName = file.name.split('.')[0] || 'New file';
      return new Promise((resolve, reject) => {
        reader.addEventListener(
          'load',
          function () {
            resolve({ src: reader.result as string | ArrayBuffer, alt: fileName });
          },
          false
        );
        reader.addEventListener(
          'error',
          function () {
            reject(`An error occurred while reading the file: ${file.name}`);
          },
          false
        );
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises)
      .then((images) => {
        setImages((prev: any) => [...prev, ...images]);
        setUpdatingImage(false);
        onChangePicture(images.map((image: any) => image.src));
      })
      .catch((error) => {
        console.error(error);
        setPictureError(error);
        setUpdatingImage(false);
      });
  };

  const handleOnClickPicture = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  useEffect(() => {
    if (resetImages) {
      setImages([{ src: '', alt: '' }]);
      setResetImages(false);
    }
  }, [resetImages, setResetImages]);
  return (
    <div className="grid grid-cols-6 gap-x-4">
      {images?.map((image: any) => (
        <button
          key={image?.src}
          disabled={updatingImage}
          onClick={handleOnClickPicture}
          className={classNames(
            'relative w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition group focus:outline-none py-4 h-40 ',
            image?.src
              ? 'hover:opacity-50 disabled:hover:opacity-100 my-3 col-span-3 h-72'
              : 'border-2 border-dashed border-secondary hover:border-primary col-span-6 h-40 disabled:hover:border-gray-200'
          )}>
          {image?.src ? <Image src={image.src as string} alt={image?.alt ?? ''} layout="fill" objectFit={'cover'} /> : null}

          <div className="flex items-center justify-center">
            {!image?.src ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="shrink-0 rounded-full p-2 bg-gray-200 group-hover:scale-110 group-focus:scale-110 transition">
                  <AiOutlineArrowUp className="w-4 h-4 text-gray-500 transition" />
                </div>
                <span className="text-xs font-semibold text-gray-500 transition">{updatingImage ? 'Uploading...' : 'Upload Image'}</span>
              </div>
            ) : null}
            <Controller
              render={() => (
                <input
                  ref={imageRef}
                  type="file"
                  multiple
                  accept={'.png, .jpg, .jpeg, .gif, .webp'}
                  onChange={handleOnChangePicture}
                  className="hidden"
                />
              )}
              control={control}
              name="images"
              rules={{
                required: 'Image is required',
              }}></Controller>
          </div>
        </button>
      ))}
      {imageError ? <span className="text-red-600 text-sm">{imageError}</span> : null}
    </div>
  );
};

export default ImageUpload;
