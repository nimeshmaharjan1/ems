import MainSharedLayout from '@/shared/layouts/main';
import ViewAllLayout from '@/shared/layouts/view-all';
import ViewOneLayout from '@/shared/layouts/view-one';
import React, { ReactNode } from 'react';

const Product = () => {
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
