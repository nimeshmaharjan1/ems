import MainSharedLayout from '@/shared/layouts/main/index';
import Image from 'next/image';
import React from 'react';
import { NextPageWithLayout } from '../_app';

const About: NextPageWithLayout = () => {
  return (
    <div className="prose xl:prose-xl prose-img:rounded-xl prose-img:shadow lg:prose-lg !max-w-none">
      <h1>Welcome to Eeshan Mahadev Enterprises Ltd.</h1>

      <h2>About Us</h2>

      <p>
        Eeshan Mahadev Enterprises Ltd. is a premier distribution company based in Bangemudha, Asson, Kathmandu, Nepal. Established in 2020,
        we have rapidly gained recognition as a trusted distributor of high-quality brands in the market. Our commitment to excellence,
        customer satisfaction, and a diverse product range has enabled us to become a preferred choice for retailers and businesses across
        Nepal.
      </p>

      <p>
        At Eeshan Mahadev Enterprises, we understand the importance of seamless customer interaction and fast service. That&apos;s why we
        have developed our website as a comprehensive B2B (Business-to-Business) and B2C (Business-to-Consumer) network. This platform
        allows us to streamline the ordering process, ensuring smooth communication and efficient service for our valued customers.
      </p>
      <Image src="/images/about/hero-two.jpg" className="shadow" width={2400} height={1600} alt="EME"></Image>

      <p>
        One of our key strengths lies in our exceptional after-sales service. We believe that the success of a business extends beyond the
        point of sale, and that&apos;s why we prioritize providing outstanding support even after the purchase. Our dedicated team is
        readily available to address any queries or concerns, ensuring a positive experience for our customers throughout their journey with
        our products.
      </p>

      <p>
        By focusing on superior after-sales service, we have established ourselves as a trusted name in the industry. We recognize that
        customer satisfaction and loyalty are the keys to sustainable growth. Our commitment to delivering reliable products, coupled with
        our dedication to exceptional service, has earned us a solid reputation among our clients.
      </p>

      <p>
        At Eeshan Mahadev Enterprises, we go the extra mile to foster lasting relationships with our customers. We aim to be more than just
        a distributor; we strive to be your reliable business partner. Our team of experienced professionals is always ready to assist you,
        providing personalized guidance, market insights, and product knowledge to support your business goals.
      </p>

      <p>
        We invite you to explore our website, where you can conveniently browse our extensive range of products and place orders
        effortlessly. Our B2B and B2C network ensures a seamless experience, allowing you to connect with us easily and access our services
        quickly.
      </p>

      <p>
        Thank you for choosing Eeshan Mahadev Enterprises Ltd. as your preferred distribution partner. We are committed to serving you with
        excellence and building a prosperous future together.
      </p>

      <h2>Contact Information</h2>

      <p>
        <strong>Address:</strong> Bangemudha, Asson, Kathmandu, Nepal
      </p>

      <p>
        <strong>Phone:</strong> +977-XXXXXXX
      </p>

      <p>
        <strong>Email:</strong> info@eeshanmahadeventerprises.com
      </p>

      <p>
        <strong>Website:</strong> <a href="http://www.eeshanmahadeventerprises.com">www.eeshanmahadeventerprises.com</a>
      </p>
    </div>
  );
};

export default About;
About.getLayout = (page) => (
  <MainSharedLayout
    metaData={{
      title: 'About',
      description: 'About page for the Eshan Mahadev Private Limited Company website.',
    }}>
    {page}
  </MainSharedLayout>
);
