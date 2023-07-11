import Pagination from '@/shared/components/pagination';
import Rating from '@/shared/components/rating';
import { PaginatedReviews, SubmitReview } from '@/shared/interfaces/reviews.interface';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import RatingSummary from './rating-summary';
import UserReview from './user-review';
import WriteReviewModal from './write-review-modal';

const ReviewsSection: React.FC<{ productId: string }> = ({ productId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 5;
  const { data: session } = useSession();
  const defaultValues = {
    rating: '',
    comment: '',
    productId: productId,
    userId: session?.user?.id,
  };
  const reviewUseForm = useForm<SubmitReview>({ defaultValues });
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery<PaginatedReviews>(['getAllReviews', currentPage], async () => {
    const response = await axios.get(`/api/products/reviews?page=${currentPage}&limit=${limit}&productId=${productId}`);
    setTotalPages(response.data.totalPages);
    return response.data;
  });
  const isReviewsEmpty = !isReviewsError && reviews && reviews?.totalRecords === 0;

  return (
    <section className="grid grid-cols-6 mt-12 lg:mt-28 px-4 gap-y-12 lg:gap-y-0  lg:gap-x-32">
      {isReviewsError ? (
        <div className="col-span-6 flex items-center justify-center">
          <p className="text-error font-medium text-xl">Something went wrong while trying to get the reviews please try again later.</p>
        </div>
      ) : isReviewsLoading ? (
        <div className="col-span-6 flex items-center justify-center">
          <button className="btn btn-ghost disabled btn-xl gap-3">
            <span className="loading loading-spinner"></span>Loading reviews...
          </button>
        </div>
      ) : (
        <>
          <div className="left col-span-6 lg:col-span-2">
            <h3 className="font-bold text-2xl">Customer Reviews</h3>
            <div className="flex items-center gap-4 mt-4">
              <div className="rating-section">
                {isReviewsEmpty ? (
                  <Rating rating={0}></Rating>
                ) : (
                  <Rating rating={Number(reviews?.data.ratingSummary.averageRating)}></Rating>
                )}
              </div>
              <span className="text-sm">
                {isReviewsEmpty ? 'No reviews have been recorded.' : <>Based on {(reviews as PaginatedReviews).totalRecords} reviews</>}
              </span>
            </div>
            <section className="rating-summary-section flex flex-col gap-3 mt-5">
              <RatingSummary number="5" percentage={reviews?.data.ratingSummary.percentageRatings['5'] as string}></RatingSummary>
              <RatingSummary number="4" percentage={reviews?.data.ratingSummary.percentageRatings['4'] as string}></RatingSummary>
              <RatingSummary number="3" percentage={reviews?.data.ratingSummary.percentageRatings['3'] as string}></RatingSummary>
              <RatingSummary number="2" percentage={reviews?.data.ratingSummary.percentageRatings['2'] as string}></RatingSummary>
              <RatingSummary number="1" percentage={reviews?.data.ratingSummary.percentageRatings['1'] as string}></RatingSummary>
            </section>
            <div className="section share-review-section mt-6">
              <h3 className="text-md">Share your thoughts</h3>
              <p className="text-light text-[0.8rem] opacity-80 mt-2">
                If you’ve used this product, share your thoughts with other customers
              </p>
              <label htmlFor="write-a-review-modal" className="btn mt-6 btn-sm btn-block btn-outline btn-primary">
                Write a review
              </label>
            </div>
          </div>
          <div className="right user-reviews-section col-span-6 lg:col-span-4 flex flex-col gap-[0.8rem]">
            {reviews && (
              <>
                {reviews.data.reviews.length === 0 && <h4>No reviews have been recorded yet.</h4>}
                {reviews.data.reviews.length > 0 &&
                  reviews.data.reviews.map((review) => {
                    return <UserReview review={review} key={review.id}></UserReview>;
                  })}
                {reviews.data.reviews.length > 0 && (
                  <div className="self-end">
                    <Pagination {...{ currentPage, setCurrentPage, totalPages }}></Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      <WriteReviewModal {...{ reviewUseForm }}></WriteReviewModal>
    </section>
  );
};

export default ReviewsSection;
