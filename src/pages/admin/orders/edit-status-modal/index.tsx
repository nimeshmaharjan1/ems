import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import classNames from 'classnames';
import { MonitorUp, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

type UserProfileModalProps = {};

const EditOrderStatusModal = forwardRef<HTMLDialogElement, UserProfileModalProps>((props, ref) => {
  return (
    <dialog ref={ref} className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="text-lg font-bold">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button type="button" className="btn">
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
});

export default EditOrderStatusModal;

EditOrderStatusModal.displayName = 'Profile Modal';
