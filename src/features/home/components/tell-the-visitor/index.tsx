import Image from 'next/image';

const TellTheVisitor = () => {
  return (
    <section className="pt-16 md:pt-36 tell-the-visitor-section md:px-0 pb-16 md:pb-0 container grid grid-cols-4 items-center gap-x-12">
      <div className="col-span-4 md:col-span-2 prose prose-h2:font-bold prose-h2:text-3xl prose-h2:leading-[1.4]">
        <h2>We believe in delivering the best products.</h2>
        <p>
          We have established long-term partnerships with a range of esteemed companies, allowing us to cater to diverse customer needs with
          products that adhere to the highest industry standards.
        </p>
      </div>
      <div className="col-span-4 md:col-span-2 md:mt-0 mt-6">
        <Image className="rounded  shadow" height={1080} width={1920} src={'/home/hero-one.jpg'} quality={100} alt="Shop Image"></Image>
      </div>
    </section>
  );
};

export default TellTheVisitor;
