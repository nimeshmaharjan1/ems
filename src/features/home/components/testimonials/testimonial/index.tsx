import React from "react";
import RatingSection from "./rating-section";
import QuoteSection from "./quote-section";
import UserSection from "./user-section";

const Testimonial = () => {
  return (
    <div className="z-0">
      <div className="card bg-base-200">
        <div className="card-body !gap-y-4">
          <RatingSection></RatingSection>
          <QuoteSection></QuoteSection>
          <UserSection></UserSection>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
