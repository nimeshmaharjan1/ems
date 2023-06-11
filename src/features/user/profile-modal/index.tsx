import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { forwardRef } from 'react';

type UserProfileModalProps = {};

const UserProfileModal = forwardRef<HTMLDialogElement, UserProfileModalProps>((props, ref) => {
  const { data: session } = useSession();
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box md:!w-[95%] lg:!w-[55%] !max-w-none">
        <h2 className="font-[600] text-2xl mb-6">My Profile</h2>
        <section className="grid grid-cols-6 gap-x-4">
          <div className="col-span-1 flex justify-center">
            <div className="avatar">
              <div className="w-24 rounded-full relative  ring ring-primary ring-offset-base-100 ring-offset-0">
                <Image fill alt="user" src="/icons/default-user.png" />
              </div>
            </div>
          </div>
          <div className="col-span-5">
            <form className="grid grid-cols-6 gap-3">
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
