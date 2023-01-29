import classNames from 'classnames';
import Image from 'next/legacy/image';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { IProductCreate } from '../../products/interfaces';
interface Props {
  label?: string;
  initialImage: { src: string | ArrayBuffer | null; alt: string };
  accept?: string;
  sizeLimit?: number;
  onChangePicture: (image: string | ArrayBuffer | null) => void;
  control: Control<IProductCreate>;
}

const ImageUpload: React.FC<Props> = ({
  label = 'Image',
  initialImage,
  accept = '.png, .jpg, .jpeg, .gif',
  sizeLimit = 10 * 1024 * 1024, // 10MB
  onChangePicture,
  control,
}) => {
  const imageRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<{ src: string | ArrayBuffer | null; alt: string }>(initialImage);
  const [updatingImage, setUpdatingImage] = React.useState(false);
  const [imageError, setPictureError] = React.useState('');
  const handleOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    const fileName = file?.name?.split('.')?.[0] ?? 'New file';
    reader.addEventListener(
      'load',
      async function () {
        try {
          setImage({ src: reader.result as string | ArrayBuffer, alt: fileName });
          if (typeof onChangePicture === 'function') {
            onChangePicture(reader.result);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setUpdatingImage(false);
        }
      },
      false
    );

    if (file) {
      if (file.size <= sizeLimit) {
        setUpdatingImage(true);
        setPictureError('');
        reader.readAsDataURL(file);
      } else {
        setPictureError('File size is exceeding 10MB.');
      }
    }
  };

  const handleOnClickPicture = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  return (
    <div className="">
      <button
        disabled={updatingImage}
        onClick={handleOnClickPicture}
        className={classNames(
          'relative w-full aspect-w-16 aspect-h-9 overflow-hidden rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition group focus:outline-none py-4 h-40 md:h-72',
          image?.src
            ? 'hover:opacity-50 disabled:hover:opacity-100'
            : 'border-2 border-dashed border-secondary hover:border-primary  disabled:hover:border-gray-200'
        )}
      >
        {image?.src ? <Image src={image.src as string} alt={image?.alt ?? ''} layout="fill" objectFit={'cover'} /> : null}

        <div className="flex items-center justify-center">
          {!image?.src ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="shrink-0 rounded-full p-2 bg-gray-200 group-hover:scale-110 group-focus:scale-110 transition">
                <AiOutlineArrowUp className="w-4 h-4 text-gray-500 transition" />
              </div>
              <span className="text-xs font-semibold text-gray-500 transition">{updatingImage ? 'Uploading...' : 'Upload'}</span>
            </div>
          ) : null}
          <Controller
            render={() => (
              <input
                ref={imageRef}
                type="file"
                accept={'.png, .jpg, .jpeg, .gif, .webp'}
                onChange={handleOnChangePicture}
                className="hidden"
              />
            )}
            control={control}
            name="image"
            rules={{
              required: 'Image is required',
            }}
          ></Controller>
        </div>
      </button>

      {imageError ? <span className="text-red-600 text-sm">{imageError}</span> : null}
    </div>
  );
};

export default ImageUpload;
