import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MainSharedLayout from '@/shared/layouts/main';
import { ArrowDown } from 'lucide-react';
import { NextPageWithLayout } from './_app';
import Image from 'next/image';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <section className="flex items-center justify-center relative mx-auto w-full min-h-[calc(100vh-10rem)] max-w-[64rem] flex-col  gap-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Discover the Latest Appliances at <span className="text-primary">Eeshan Mahadev Enterprises Private Limited.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
          <span className="max-w-[46rem] text-lg text-opacity-60 sm:text-xl">
            Explore a wide range of premium denim products from top brands and independent stores worldwide.
          </span>
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="btn btn-primary mt-2">
          Shop Now
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="bg-primary h-8 w-8 rounded-full absolute bottom-0 lg:bottom-0 right-0 animate-bounce flex items-center justify-center">
          <ArrowDown className="text-neutral-content"></ArrowDown>
        </motion.div>
      </section>
      <section className="mt-16 lg:mt-20">
        <div className="slider container">
          <div className="slide-track">
            <div className="slide">
              <Image src="/images/brands/cg.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/black.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/godrej.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/lg.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/kent.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/midea.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/tck.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/sensei.png" height="250" width="250" alt="" />
            </div>{' '}
            <div className="slide">
              <Image src="/images/brands/cg.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/black.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/godrej.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/lg.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/kent.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/midea.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/tck.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/sensei.png" height="250" width="250" alt="" />
            </div>{' '}
            <div className="slide">
              <Image src="/images/brands/cg.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/black.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/godrej.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/lg.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/kent.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/midea.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/tck.png" height="250" width="250" alt="" />
            </div>
            <div className="slide">
              <Image src="/images/brands/sensei.png" height="250" width="250" alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

Home.getLayout = (page) => (
  <MainSharedLayout
    metaData={{
      title: 'Home',
      description: 'Home page for Eeshan Mahadev Enterprises Private Limited which is located at Bangemudha, Asson, Kathmandu, Nepal',
    }}>
    {page}
  </MainSharedLayout>
);
