import Image from 'next/image';
import React from 'react';

const TellTheVisitor = () => {
  return (
    <section className="p-8 md:py-20 md:px-16 tell-the-visitor-section container grid grid-cols-6 items-center gap-x-12">
      <div className="col-span-6 md:col-span-3 prose prose-h2:font-bold prose-h2:text-3xl prose-h2:leading-[1.4]">
        <h2>We believe in delivering the best products.</h2>
        <p>
          We have established long-term partnerships with a range of esteemed companies, allowing us to cater to diverse customer needs with
          products that adhere to the highest industry standards.
        </p>
      </div>
      <div className="col-span-6 md:col-span-3 md:mt-0 mt-6">
        <Image className="h-96 rounded shadow" height={800} width={1920} src={'/home/hero-one.jpg'} quality={100} alt="Shop Image"></Image>
      </div>
    </section>
  );
};

export default TellTheVisitor;
