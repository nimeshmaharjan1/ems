import Pagination from '@/shared/components/pagination';
import Rating from '@/shared/components/rating';
import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import RatingSummary from './rating-summary';
import UserReview from './user-review';

const ReviewsSection = () => {
  return (
    <section className="grid grid-cols-6 mt-28 px-4 gap-x-32">
      <div className="left col-span-2">
        <h3 className="font-bold text-2xl">Customer Reviews</h3>
        <div className="flex items-center gap-4 mt-4">
          <div className="rating-section">
            <Rating></Rating>
          </div>
          <span className="text-sm">Based on 1624 reviews</span>
        </div>
        <section className="rating-summary-section flex flex-col gap-3 mt-5">
          <RatingSummary number="5" percentage="64"></RatingSummary>
          <RatingSummary number="4" percentage="82"></RatingSummary>
          <RatingSummary number="3" percentage="42"></RatingSummary>
          <RatingSummary number="2" percentage="3"></RatingSummary>
          <RatingSummary number="1" percentage="0"></RatingSummary>
        </section>
        <div className="section share-review-section mt-8">
          <h3 className="text-md">Share your thoughts</h3>
          <p className="text-light text-xs opacity-80 mt-2">If you’ve used this product, share your thoughts with other customers</p>
          <button className="btn mt-6 btn-sm btn-block btn-outline btn-primary">Write a review</button>
        </div>
      </div>
      <div className="right user-reviews-section col-span-4 flex flex-col gap-[0.8rem]">
        <UserReview></UserReview>
        <UserReview></UserReview>
        <div className="self-end">
          <Pagination></Pagination>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
