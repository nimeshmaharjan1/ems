import Testimonial from './testimonial';

import { Swiper, SwiperSlide } from 'swiper/react';

const Testimonials = () => {
  return (
    <section className="testimonials-section md:py-24 md:px-16 md:container">
      {/* <h2 className="font-bold text-3xl leading-[1.4] mb-10">Customer Testimonials</h2> */}
      <Swiper
        breakpoints={{
          // when window width is >= 640px
          320: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 3,
          },
        }}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        className="z-0">
        <SwiperSlide>
          <Testimonial></Testimonial>
        </SwiperSlide>
        <SwiperSlide>
          <Testimonial></Testimonial>
        </SwiperSlide>
        <SwiperSlide>
          <Testimonial></Testimonial>
        </SwiperSlide>
        <SwiperSlide>
          <Testimonial></Testimonial>
        </SwiperSlide>
        <SwiperSlide>
          <Testimonial></Testimonial>
        </SwiperSlide>
        <SwiperSlide>
          <Testimonial></Testimonial>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Testimonials;
