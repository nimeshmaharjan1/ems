import { BadgeCheck, Boxes, CalendarHeart, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section className="container px-4 why-choose-us grid grid-cols-1 md:grid-cols-8 gap-6 md:gap-12 mt-12 md:mt-0 ">
      <div className="col-span-1 md:col-span-4 flex gap-x-4">
        <div>
          <Sparkles size={30} strokeWidth={1.3}></Sparkles>
        </div>
        <div>
          <p className="font-bold">Unparalleled Service</p>
          <p className="prose pt-3">
            We prioritize customer satisfaction above all else. Our dedicated team is always ready to assist you, providing prompt and
            efficient service.
          </p>
        </div>
      </div>
      <div className="col-span-1 md:col-span-4 flex gap-x-4">
        <div>
          <Boxes size={32} strokeWidth={1} />
        </div>
        <div>
          <p className="font-bold">Wide Range of Products</p>
          <p className="prose pt-3 ">
            We offer a diverse selection of home appliances from top-notch brands. Whether you need modern kitchen gadgets or essential
            household appliances, we have it all.
          </p>
        </div>
      </div>{' '}
      <div className="col-span-1 md:col-span-4 flex gap-x-4">
        <div>
          <BadgeCheck size={30} strokeWidth={1.3} />
        </div>
        <div>
          <p className="font-bold">Quality Assurance</p>
          <p className="prose pt-3">
            Our commitment to quality is unwavering. We source products directly from reputed manufacturers, ensuring you receive only the
            best products.
          </p>
        </div>
      </div>
      <div className="col-span-1 md:col-span-4 flex gap-x-4">
        <div>
          <CalendarHeart size={30} strokeWidth={1.3} />
        </div>
        <div>
          <p className="font-bold">Timely Deliveries</p>
          <p className="prose pt-3">With a well-organized logistics network, we guarantee on-time deliveries to our valued customers.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
