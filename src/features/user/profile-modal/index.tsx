import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import { MonitorUp, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { forwardRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type UserProfileModalProps = {};

const UserProfileModal = forwardRef<HTMLDialogElement, UserProfileModalProps>((props, ref) => {
  const { data: session } = useSession();
  const profileImageUploadRef = useRef<HTMLInputElement>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const { register, setValue } = useForm({
    defaultValues: {
      image: session?.user?.image,
    },
  });
  const upload = async (image: string | ArrayBuffer | null) => {
    setIsFileUploading(true);
    try {
      const response = await axios.post('/api/image-upload', { image });
      const url = response.data.url;
      setValue('image', url);
      showToast(Toast.success, 'All images uploaded successfully.');
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
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box md:!w-[95%] lg:!w-[56%] !max-w-none">
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
                  <Image className="profile-image" fill alt="user" src={session?.user?.image || '/icons/default-user.png'} />
                  <Upload strokeWidth={1} className="profile-icon absolute top-9 left-9" />
                  <input
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
            <form className="grid grid-cols-6 gap-3 items-center">
              <div className="form-control w-full col-span-3">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  defaultValue={session?.user?.name as string}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="form-control w-full  col-span-3">
                <label className="label">
                  <span className="label-text">E-mail</span>
                </label>
                <input
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
                  defaultValue={session?.user?.phone_number}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
            </form>
          </div>
        </section>

        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn" onClick={() => (ref as any).current.close()}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default UserProfileModal;

UserProfileModal.displayName = 'Profile Modal';
