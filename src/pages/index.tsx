import MainSharedLayout from '@/shared/layouts/main';
import { NextPageWithLayout } from './_app';

// const Home: NextPageWithLayout = () => {
//   const { data: featuredProducts, isLoading: isTopSellingProductLoading } =
//     useQuery<IProduct[]>("fetchFeaturedProducts", async () => {
//       const res = await axios.get("/api/products?page=1&limit=4");
//       return res.data.products;
//     });
//   return (
//     <>
//       <section className="flex items-center justify-center relative mx-auto w-full min-h-[calc(100vh-10rem)] max-w-[64rem] flex-col  gap-4 text-center">
//         <motion.h2
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.5 }}
//           className="text-3xl font-bold leading-tight tracking-normal md:text-5xl lg:text-6xl lg:leading-[1.1]"
//         >
//           Discover the Latest Appliances at{" "}
//           <span className="text-primary">
//             Eeshan Mahadev Enterprises Private Limited.
//           </span>
//         </motion.h2>
//         <motion.p
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1 }}
//           className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl"
//         >
//           <span className="max-w-[46rem] text-lg text-opacity-60 sm:text-xl">
//             Explore a wide range of premium denim products from top brands and
//             independent stores worldwide.
//           </span>
//         </motion.p>
//         <motion.button
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.5 }}
//           className="btn btn-primary mt-2"
//         >
//           Shop Now
//         </motion.button>
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 2 }}
//           className="bg-primary h-8 w-8 rounded-full absolute bottom-0 lg:bottom-0 right-0 animate-bounce flex items-center justify-center"
//         >
//           <ArrowDown className="text-neutral-content"></ArrowDown>
//         </motion.div>
//       </section>
//       <section className="mt-24 lg:mt-32">
//         <BrandsScrolling></BrandsScrolling>
//       </section>
//       <section className="mt-24 lg:mt-32">
//         <h2 className="brands font-bold text-2xl md:text-3xl mb-8">
//           Featured Products
//         </h2>
//         <div className="grid grid-cols-4">
//           {featuredProducts?.map((product) => (
//             <div
//               className="col-span-6 md:col-span-2 lg:col-span-1"
//               key={product.id}
//             >
//               <ProductCard product={product}></ProductCard>
//             </div>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// };

// export default Home;

import HeroSection from '@/features/home/components/hero-section';
import TellTheVisitor from '@/features/home/components/tell-the-visitor';
import Testimonials from '@/features/home/components/testimonials';
import WhyChooseUs from '@/features/home/components/why-choose-us';
import Image from 'next/image';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Image
        className="h-[28rem] object-cover w-full"
        height={800}
        width={1920}
        src={'/home/hero-three.jpg'}
        quality={100}
        alt="Shop Image"></Image>
      <HeroSection></HeroSection>
      <WhyChooseUs></WhyChooseUs>
      <TellTheVisitor></TellTheVisitor>
      <Testimonials></Testimonials>
    </>
  );
};

export default Home;

Home.getLayout = (page) => (
  <MainSharedLayout
    metaData={{
      title: 'Home',
      isHome: true,
      description: 'Home page for Eeshan Mahadev Enterprises Private Limited which is located at Bangemudha, Asson, Kathmandu, Nepal',
    }}>
    {page}
  </MainSharedLayout>
);

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: '/products',
    },
    props: {},
  };
};
