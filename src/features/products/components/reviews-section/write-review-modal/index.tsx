import { SubmitReview } from '@/shared/interfaces/reviews.interface';
import { showToast, Toast } from '@/shared/utils/toast.util';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { useMutation, useQueryClient } from 'react-query';
import WriteReviewRating from '../write-review-rating';

const WriteReviewModal: React.FC<{ reviewUseForm: UseFormReturn<SubmitReview> }> = ({ reviewUseForm }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const closeModalRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries({ queryKey: ['getAllReviews'] });
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
        if (error?.response?.status === 401) {
          signIn();
        }
      },
    }
  );
  const submitReview = (data: SubmitReview) => {
    if (!session) {
      showToast(Toast.warning, 'You must be logged in to write a review.');
      signIn();
      return;
    }
    const newData = { ...data, rating: Number(data.rating), userId: session?.user?.id as string };
    mutate(newData);
  };
  useEffect(() => {
    return () => {
      reviewUseForm.reset();
    };
  }, [reviewUseForm]);
  return (
    <>
      <input type="checkbox" id="write-a-review-modal" className="modal-toggle" ref={closeModalRef} onClick={() => reviewUseForm.reset()} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="relative modal-box">
          <label htmlFor="write-a-review-modal" className="absolute btn btn-outline btn-sm btn-circle right-3 top-3">
            <AiOutlineClose></AiOutlineClose>
          </label>
          <h3 className="text-xl font-bold">Write Review</h3>
          <div className="flex flex-col items-center gap-3 mt-6 review-body">
            <div className="avatar online">
              <div className="w-16 h-16 rounded-full shadow-md">
                <Image src={session?.user?.image || '/icons/default-user.png'} height={500} width={500} alt="user" />
              </div>
            </div>
            <h4 className="text-xl font-medium">{session?.user?.username}</h4>
            <WriteReviewRating reviewUseForm={reviewUseForm}></WriteReviewRating>
            <textarea
              {...reviewUseForm.register('comment')}
              className="w-full mt-4 textarea textarea-bordered"
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
