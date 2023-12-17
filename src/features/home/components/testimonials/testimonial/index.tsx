import QuoteSection from './quote-section';
import RatingSection from './rating-section';
import UserSection from './user-section';

const Testimonial = ({ testimonial }: any) => {
  return (
    <div className="z-0">
      <div className="card bg-base-200">
        <div className="card-body !gap-y-4">
          <RatingSection></RatingSection>
          <QuoteSection {...{ testimonial }}></QuoteSection>
          <UserSection {...{ testimonial }}></UserSection>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
