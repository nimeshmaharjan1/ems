import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import { MonitorUp, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

type UserProfileModalProps = {};

interface IForm {
  image?: string | null;
  name: string;
  username: string;
  phone_number: string;
}

const UserProfileModal = forwardRef<HTMLDialogElement, UserProfileModalProps>((props, ref) => {
  const { data: session } = useSession();
  const profileImageUploadRef = useRef<HTMLInputElement>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const { isLoading: isLoadingUserProfile, data: userData } = useQuery(['getUserProfile'], async () => {
    const response = await axios.get(`/api/users/${session?.user?.id}`);
    return response.data;
  });
  console.log(userData);
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<IForm>({
    defaultValues: {
      image: session?.user?.image,
      username: session?.user?.username,
      name: session?.user?.name as string,
      phone_number: session?.user?.phone_number,
    },
  });

  useEffect(() => {
    if (userData?.user) {
      setValue('image', userData.user?.image);
      setValue('name', userData.user?.name);
      setValue('phone_number', userData.user?.phone_number);
      setValue('username', userData.user?.username);
    }
  }, [setValue, userData?.user]);

  const upload = async (image: string | ArrayBuffer | null) => {
    setIsFileUploading(true);
    try {
      const response = await axios.post('/api/image-upload', { image });
      const url = response.data.url;
      setValue('image', url);
      showToast(Toast.success, 'Profile image updated.');
    } catch (e) {
      showToast(Toast.error, 'Something went wrong while trying to upload the images please try again.');
    } finally {
      setIsFileUploading(false);
    }
  };
  const handleOnChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      return showToast(Toast.error, 'Image cannot be larger than 5MB.');
    }
    const readerPromise = () => {
      const reader = new FileReader();
      const fileName = file.name.split('.')[0] || 'New File';
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
    };
    try {
      const image = await readerPromise();
      console.log({ image });
      upload((image as any).src);
    } catch (error) {
      showToast(Toast.error, 'Something went wrong while trying to upload the image.');
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateUser: SubmitHandler<IForm> = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/users/${session?.user?.id}`, values);
      showToast(Toast.success, response.data.message);
    } catch (error: any) {
      if (error.response.data.error.meta.target[0] === 'phone_number') {
        setError('phone_number', { type: 'custom', message: 'Phone number is already associated with another user.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <form onSubmit={handleSubmit(updateUser)} className="modal-box md:!w-[95%] lg:!w-[56%] !max-w-none">
        {isLoadingUserProfile ? (
          <div className="text-center">
            <button className="btn btn-ghost">
              <span className="loading loading-spinner"></span>
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-[600] text-2xl mb-6">My Profile</h2>
            <section className="grid grid-cols-6 gap-x-4">
              <div className="col-span-1 flex justify-center">
                <div>
                  <div
                    onClick={() => {
                      profileImageUploadRef.current?.click();
                    }}
                    className="avatar cursor-pointer profile-modal-avatar relative mt-3">
                    <div className="w-24 rounded-full relative  shadow-lg ring-offset-base-100 ring-offset-0">
                      <Image
                        className="profile-image"
                        fill
                        alt="user"
                        src={watch('image') || session?.user?.image || '/icons/default-user.png'}
                      />
                      <Upload strokeWidth={1} className="profile-icon absolute top-9 left-9" />
                      <input
                        disabled={isSubmitting || isFileUploading}
                        ref={profileImageUploadRef}
                        accept={'.png, .jpg, .jpeg, .gif, .webp'}
                        type="file"
                        className="hidden"
                        onChange={handleOnChangeImage}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <section className="grid grid-cols-6 gap-3 items-center">
                  <div className="form-control w-full col-span-3">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      disabled={isSubmitting}
                      defaultValue={session?.user?.name as string}
                      type="text"
                      {...register('name', {
                        required: 'Name is required.',
                      })}
                      placeholder="Type here"
                      className={classNames('input input-bordered w-full max-w-xs', {
                        'input-error': errors?.name?.message,
                      })}
                    />
                  </div>

                  <div className="form-control w-full col-span-3">
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    <input
                      disabled={isSubmitting}
                      defaultValue={session?.user?.username as string}
                      type="text"
                      {...register('username', {
                        required: 'Username is required.',
                      })}
                      placeholder="Type here"
                      className={classNames('input input-bordered w-full max-w-xs', {
                        'input-error': errors?.username?.message,
                      })}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="label text-error text-sm -mt-3">{errors?.name?.message}</label>
                  </div>
                  <div className="col-span-3">
                    <label className="label text-error text-sm -mt-3">{errors?.username?.message}</label>
                  </div>
                  <div className="form-control w-full  col-span-3">
                    <label className="label">
                      <span className="label-text">E-mail</span>
                    </label>
                    <input
                      disabled
                      defaultValue={session?.user?.email as string}
                      type="email"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                  <div className="form-control w-full  col-span-3">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      disabled={isSubmitting}
                      defaultValue={session?.user?.phone_number}
                      type="text"
                      {...register('phone_number', {
                        required: 'Phone number is required.',
                      })}
                      placeholder="Type here"
                      className={classNames('input  input-bordered w-full max-w-xs', {
                        'input-error': errors?.phone_number?.message,
                      })}
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="label text-error text-sm -mt-3"></label>
                  </div>
                  <div className="col-span-3">
                    <label className="label text-error text-sm -mt-3">{errors?.phone_number?.message}</label>
                  </div>
                </section>
              </div>
            </section>

            <div className="modal-action px-4 gap-2">
              {/* if there is a button in form, it will close the modal */}
              <button type="button" className="btn" onClick={() => (ref as any).current.close()}>
                Close
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </>
        )}
      </form>
    </dialog>
  );
});

export default UserProfileModal;

UserProfileModal.displayName = 'Profile Modal';
