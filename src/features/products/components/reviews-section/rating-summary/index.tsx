import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const RatingSummary: React.FC<{ number: string; percentage: string }> = ({ number, percentage }) => {
  return (
    <div className="rating-summary flex gap-2 items-center">
      <span className="text-xs font-medium ">{number}</span>
      <i className="fas fa-star text-yellow-400">
        <AiFillStar />
      </i>
      <progress className="progress progress-accent" value={percentage} max="100"></progress>
      <span className="text-xs ml-3 font-light">{percentage}%</span>
    </div>
  );
};

export default RatingSummary;
