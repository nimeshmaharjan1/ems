import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { PrismaClient, Product } from '@prisma/client';
import MainSharedLayout from '@/shared/layouts/main';
import ProductCard from '@/features/products/components/product-card';
import { NextPageWithLayout } from '../_app';
import ViewAllLayout from '@/shared/layouts/view-all';
import Router, { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import axios from 'axios';

const Home: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: productData,
    isError,
    isLoading,
  } = useQuery<{ products: Product[] }, Error>('fetchProducts', async () => {
    const response = await axios.get('/api/products');
    return response.data;
  });

  if (!isMounted) return null;

  if (isError) {
    return (
      <>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-error relative uppercase pb-1">
            Error
            <span
              className="bg-error"
              style={{
                content: '',
                width: '70px',
                height: '3px',
                display: 'inline-block',
                position: 'absolute',
                bottom: '-8px',
                left: '0',
              }}
            ></span>
          </h1>
        </header>
        <div>Something went wrong while trying to get the products please try again later.</div>
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-12 gap-6 mt-10">
          {Array(6)
            .fill(0)
            .map((_, index) => {
              return (
                <div key={index} className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center">
                  <div className="flex flex-col rounded shadow-md w-full sm:w-80 animate-pulse h-96">
                    <div className="h-48 rounded-t bg-base-200"></div>
                    <div className="flex-1 px-4 py-8 space-y-4 sm:p-8 bg-base-300">
                      <div className="w-full h-6 rounded bg-base-200"></div>
                      <div className="w-full h-6 rounded bg-base-200"></div>
                      <div className="w-3/4 h-6 rounded bg-base-200"></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }

  if (productData?.products?.length === 0) {
    return <div className="md:mt-16 text-warning">No products available at this moment.</div>;
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold relative uppercase pb-1">
          macbook pro
          <span
            className="bg-primary"
            style={{
              content: '',
              width: '70px',
              height: '3px',
              display: 'inline-block',
              position: 'absolute',
              bottom: '-8px',
              left: '0',
            }}
          ></span>
        </h1>
      </header>
      <div className="grid grid-cols-12 gap-6">
        {productData?.products &&
          productData.products.map((product, productIndex) => {
            return (
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                <ProductCard handleProductClick={handleProductClick} {...{ product }} key={product.id}></ProductCard>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return (
    <MainSharedLayout>
      <ViewAllLayout>{page}</ViewAllLayout>
    </MainSharedLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const products = await prisma.product.findMany();
//     return {
//       props: {
//         products: JSON.parse(JSON.stringify(products)),
//       },
//     };
//   } catch (error) {
//     console.error(error);
//   }
//   return {
//     props: {
//       products: null,
//     },
//   };
// };
