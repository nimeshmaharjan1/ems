import React, { ReactNode } from 'react';
import { NextPageWithLayout } from './_app';
import MainLayout from '@/shared/layouts/main';

const Home: NextPageWithLayout = () => {
  return <div>Home</div>;
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return <MainLayout title="Dashboard">{page}</MainLayout>;
};
