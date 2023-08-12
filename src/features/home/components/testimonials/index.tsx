import React from "react";
import Testimonial from "./testimonial";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const Testimonials = () => {
  return (
    <section className="testimonials-section py-24 px-16 container ">
      <h2 className="font-bold text-3xl leading-[1.4] mb-10">
        Customer Testimonials
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        className="z-0"
        navigation
        modules={[Navigation]}
      >
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
