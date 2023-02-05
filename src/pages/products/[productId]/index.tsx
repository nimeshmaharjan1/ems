import { NextPageWithLayout } from '@/pages/_app';
import MainSharedLayout from '@/shared/layouts/main';
import ViewOneLayout from '@/shared/layouts/view-one';
import { PrismaClient, Product } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Get the current home from the database
  const id = ctx?.params?.productId as string;
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (product) {
    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
    };
  }

  return {
    redirect: {
      destination: '/products',
      permanent: false,
    },
  };
};

const Product: NextPageWithLayout<{ product: Product }> = ({ product }) => {
  console.log(product);
  return <div>Product</div>;
};

export default Product;

Product.getLayout = (page: ReactNode) => {
  return (
    <MainSharedLayout>
      <ViewOneLayout>{page}</ViewOneLayout>
    </MainSharedLayout>
  );
};
