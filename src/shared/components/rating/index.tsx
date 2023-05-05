import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const Rating = ({ rating = 4 }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
        <i key={i} className="fas fa-star text-yellow-400">
          <AiFillStar />
        </i>
      );
    } else {
      stars.push(
        <i key={i} className="far fa-star text-gray-500">
          <AiFillStar />
        </i>
      );
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default Rating;
