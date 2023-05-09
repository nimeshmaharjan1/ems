import { SubmitReview } from '@/shared/interfaces/reviews.interface';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useRef } from 'react';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { useMutation } from 'react-query';
import WriteReviewRating from '../write-review-rating';
import { Review } from '@prisma/client';
import axios from 'axios';
import { showToast, Toast } from '@/shared/utils/toast.util';

const WriteReviewModal: React.FC<{ reviewUseForm: UseFormReturn<SubmitReview> }> = ({ reviewUseForm }) => {
  const { data: session } = useSession();
  const closeModalRef = useRef<HTMLInputElement>(null);

  const { mutate, isLoading } = useMutation(
    async (data: any) => {
      const response = await axios.post(`/api/products/reviews`, data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        closeModalRef?.current?.click();
        showToast(Toast.success, data?.message);
        reviewUseForm.reset();
      },
    }
  );
  const submitReview = (data: SubmitReview) => {
    console.log(data);
    const newData = { ...data, rating: Number(data.rating) };
    mutate(newData);
  };
  return (
    <>
      <input type="checkbox" id="write-a-review-modal" className="modal-toggle" ref={closeModalRef} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label htmlFor="write-a-review-modal" className="btn btn-outline btn-sm btn-circle absolute right-3 top-3">
            <AiOutlineClose></AiOutlineClose>
          </label>
          <h3 className="font-bold text-xl">Write Review</h3>
          <div className="review-body flex flex-col gap-3 items-center mt-6">
            <div className="avatar online">
              <div className="w-16 h-16 rounded-full shadow-md">
                <Image src="/icons/default-user.png" className="p-1" height={500} width={500} alt="user" />
              </div>
            </div>
            <h4 className="font-medium text-xl">{session?.user?.username}</h4>
            <WriteReviewRating reviewUseForm={reviewUseForm}></WriteReviewRating>
            <textarea
              {...reviewUseForm.register('comment')}
              className="textarea textarea-bordered mt-4 w-full"
              placeholder="Additional Comments..."></textarea>
            <button className={`btn btn-primary mt-3 ${isLoading ? 'loading' : ''}`} onClick={reviewUseForm.handleSubmit(submitReview)}>
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WriteReviewModal;
