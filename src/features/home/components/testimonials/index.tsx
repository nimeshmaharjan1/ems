import React from 'react';
import Testimonial from './testimonial';

const Testimonials = () => {
  return (
    <section className="testimonials-section py-24 px-16 ">
      <h2 className="font-bold text-2xl leading-[1.4] mb-10">Customer Testimonials</h2>

      <section className="grid max-w-md grid-flow-dense grid-cols-1 grid-rows-[masonry] gap-8 text-sm leading-6 sm:max-w-2xl sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-4">
        <Testimonial></Testimonial>
        <Testimonial></Testimonial>
        <Testimonial></Testimonial>
      </section>
      {/* <section className="testimonials-section py-20 px-16 grid grid-cols-1 gap-8 text-sm leading-6  sm:mt-20 sm:max-w-2xl sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-4">
        <Testimonial></Testimonial>
        <Testimonial></Testimonial>
        <Testimonial></Testimonial>
        <Testimonial></Testimonial>
      </section> */}
    </section>
  );
};

export default Testimonials;
