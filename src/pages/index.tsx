import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from './_app';
import { GetServerSideProps } from 'next';
import { PrismaClient, Product } from '@prisma/client';
import MainSharedLayout from '@/shared/layouts/main';
import ProductCard from '@/features/products/components/product-card';

const prisma = new PrismaClient();

const Home: NextPageWithLayout<{ products: Product[] }> = ({ products }) => {
  console.log(products);
  return (
    <div className="grid grid-cols-12 gap-x-4">
      <div className="col-span-0 md:col-span-3">Filter</div>
      <div className="col-span-12 md:col-span-9">
        <header className="border-2 mb-6">Header</header>
        <div className="grid grid-cols-12 gap-6">
          {products.map((product, productIndex) => {
            return (
              <>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                  <ProductCard {...{ product }} key={product.id}></ProductCard>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                  <ProductCard {...{ product }} key={product.id}></ProductCard>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                  <ProductCard {...{ product }} key={product.id}></ProductCard>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                  <ProductCard {...{ product }} key={product.id}></ProductCard>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                  <ProductCard {...{ product }} key={product.id}></ProductCard>
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 flex justify-center" key={product.id}>
                  <ProductCard {...{ product }} key={product.id}></ProductCard>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return <MainSharedLayout>{page}</MainSharedLayout>;
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
