const QuoteSection = ({ testimonial }: any) => {
  return (
    <div className="prose">
      <p>{testimonial.testimonial}</p>
    </div>
  );
};

export default QuoteSection;
