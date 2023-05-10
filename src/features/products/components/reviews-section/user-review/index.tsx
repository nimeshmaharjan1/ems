import Rating from '@/shared/components/rating';
import { Review } from '@/shared/interfaces/reviews.interface';
import Image from 'next/image';
import React from 'react';

const UserReview: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <section className="user-review border-b-2 pb-6 pt-6 first:pt-0 last:border-b-0">
      <div className="user-detail flex gap-4">
        {/* <Image width={100} height={100} alt="review-user" src="/icons/default-user.png" /> */}
        <div className="avatar w-[2.8rem]">
          <Image
            className="rounded-full shadow"
            fill
            quality={100}
            alt="review-user"
            src={review.user.image ? review.user.image : '/icons/default-user.png'}
          />
        </div>
        <div className="details">
          <p className="font-bold mb-1">{review.user.username ? review.user.username : review.user.email}</p>
          <div className="rating-section">
            <Rating rating={review.rating}></Rating>
          </div>
        </div>
      </div>
      <section className="user-comment-section mt-5">
        <p className="text-sm xl:text-base opacity-80  leading-relaxed" style={{ wordWrap: 'break-word' }}>
          {review.comment}
        </p>
      </section>
    </section>
  );
};

export default UserReview;
