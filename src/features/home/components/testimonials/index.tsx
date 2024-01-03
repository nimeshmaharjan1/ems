import Testimonial from './testimonial';
const testimonials = [
  {
    id: 1,
    userName: 'Sarah Johnson',
    testimonial:
      "I recently purchased a refrigerator from Eeshan Mahadev Enterprises, and I couldn't be happier with my experience. The staff was incredibly knowledgeable and helped me find the perfect appliance to suit my needs. The delivery was prompt, and the appliance is of excellent quality. I highly recommend Eeshan Mahadev Enterprises for anyone in search of top-notch appliances.",
  },
  {
    id: 2,
    userName: 'Raj Patel',
    testimonial:
      "Eeshan Mahadev Enterprises exceeded my expectations when I bought a washing machine from them. The customer service was exceptional, providing me with valuable information to make an informed decision. The store offers a wide range of high-quality appliances, and the delivery was smooth and on time. I'm a satisfied customer and will definitely return for my future appliance needs.",
  },
  {
    id: 3,
    userName: 'Lisa Thompson',
    testimonial:
      'I had a fantastic experience shopping at Eeshan Mahadev Enterprises for my kitchen appliances. The showroom had a great selection, and the staff was friendly and helpful. They guided me through the features of different products and helped me choose appliances. The delivery team was efficient, and my kitchen is now equipped with top-notch appliances. Thank you, Eeshan Mahadev Enterprises!',
  },
];
const Testimonials = () => {
  return (
    <section className="testimonials-section px-4 md:px-0 pt-8  pb-16 md:py-36 md:container">
      <h2 className="font-bold text-2xl md:text-4xl leading-[1.4] mb-10">What people say about us</h2>
      <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
        {testimonials.map((t) => (
          <Testimonial key={t.id} testimonial={t}></Testimonial>
        ))}
      </section>
      {/* <Swiper
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
      </Swiper> */}
    </section>
  );
};

export default Testimonials;
