import React from 'react';

const RatingSection = () => {
  return (
    <section className="rating-section">
      <div className="rating">
        <input type="radio" name="rating-2" className="mask mask-star-2 !w-4 !h-4 !bg-amber-400" />
        <input type="radio" name="rating-2" className="mask mask-star-2 !w-4 !h-4 !bg-amber-400" />
        <input type="radio" name="rating-2" className="mask mask-star-2 !w-4 !h-4 !bg-amber-400" />
        <input type="radio" name="rating-2" className="mask mask-star-2 !w-4 !h-4 !bg-amber-400" />
        <input type="radio" name="rating-2" className="mask mask-star-2 !w-4 !h-4 !bg-amber-400" checked />
      </div>
    </section>
  );
};

export default RatingSection;
