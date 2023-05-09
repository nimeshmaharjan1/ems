import { SubmitReview } from '@/shared/interfaces/reviews.interface';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import WriteReviewRating from '../write-review-rating';

const WriteReviewModal: React.FC<{ reviewUseForm: UseFormReturn<SubmitReview> }> = ({ reviewUseForm }) => {
  const { data: session } = useSession();
  const submitReview: SubmitHandler<SubmitReview> = (data) => {
    console.log(data);
  };
  return (
    <>
      <input type="checkbox" id="write-a-review-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label htmlFor="write-a-review-modal" className="btn btn-outline btn-sm btn-circle absolute right-3 top-3">
            <AiOutlineClose></AiOutlineClose>
          </label>
          <h3 className="font-bold text-xl" onClick={reviewUseForm.handleSubmit(submitReview)}>
            Write Review
          </h3>
          <div className="review-body flex flex-col gap-3 items-center mt-6">
            <div className="avatar online">
              <div className="w-16 h-16 rounded-full shadow-md">
                <Image src="/icons/default-user.png" className="p-1" height={500} width={500} alt="user" />
              </div>
            </div>
            <h4 className="font-medium text-xl">{session?.user?.username}</h4>
            <WriteReviewRating reviewUseForm={reviewUseForm}></WriteReviewRating>
            <textarea className="textarea textarea-bordered mt-4 w-full" placeholder="Additional Comments..."></textarea>
            <button className="btn btn-primary mt-3">Submit Review</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WriteReviewModal;
