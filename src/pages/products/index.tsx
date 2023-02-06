import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { PrismaClient, Product } from '@prisma/client';
import MainSharedLayout from '@/shared/layouts/main';
import ProductCard from '@/features/products/components/product-card';
import { NextPageWithLayout } from '../_app';
import ViewAllLayout from '@/shared/layouts/view-all';
import Router, { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const prisma = new PrismaClient();

const Home: NextPageWithLayout<{ products: Product[] }> = ({ products }) => {
  const data = useSession();
  console.log({ data });
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
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
        {products.map((product, productIndex) => {
          return (
            <>
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                <ProductCard handleProductClick={handleProductClick} {...{ product }} key={product.id}></ProductCard>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                <ProductCard handleProductClick={handleProductClick} {...{ product }} key={product.id}></ProductCard>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                <ProductCard handleProductClick={handleProductClick} {...{ product }} key={product.id}></ProductCard>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                <ProductCard handleProductClick={handleProductClick} {...{ product }} key={product.id}></ProductCard>
              </div>
            </>
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

export const getServerSideProps: GetServerSideProps = async () => {
  let products;
  try {
    products = await prisma.product.findMany();
  } catch (error) {
    console.log(error);
  }
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};
