import Link from 'next/link';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="container hero-section md:grid md:grid-cols-6 gap-x-12 p-6 md:py-[130px] md:px-[64px]">
      <div className="col-span-12 md:col-span-3 prose-lg prose-h2:font-bold prose-h2:text-4xl prose-h2:leading-[1.4]">
        <h2>
          Welcome to <br /> Eeshan Mahadev Enterprises
        </h2>
      </div>
      <div className="col-span-12 md:col-span-3 prose mt-3 md:mt-0">
        <p>
          At Eeshan Mahadev Enterprises Pvt. Ltd., we take pride in being one of the leading distribution companies in Kathmandu, Nepal.
          With over a decade of experience, we have established ourselves as a reliable partner for more than 10 prominent companies in the
          home appliances and kitchenware industry.
        </p>
        <Link href="/products" passHref>
          <button className="btn btn-primary mt-1 md:mt-4">Shop Now</button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
