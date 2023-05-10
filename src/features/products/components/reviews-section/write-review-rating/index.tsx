import { SubmitReview } from '@/shared/interfaces/reviews.interface';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AiFillStar } from 'react-icons/ai';

const WriteReviewRating: React.FC<{ reviewUseForm: UseFormReturn<SubmitReview> }> = ({ reviewUseForm }) => {
  const { register, watch, setValue } = reviewUseForm;

  // Set up state to track the current rating value
  const [rating, setRating] = React.useState<string>('');
  // Watch for changes to the rating input and update the state

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <AiFillStar
          key={value}
          onClick={() => setValue('rating', value.toString())}
          className={`h-10 w-10 ${value <= Number(watch('rating')) ? ' text-yellow-400' : 'text-gray-500'} `}
        />
      ))}
    </div>
  );
};

export default WriteReviewRating;
