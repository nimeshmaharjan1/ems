import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/features/admin/layouts/main';

const Home: NextPageWithLayout = () => {
  return <div>Home</div>;
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return <MainLayout title="Dashboard">{page}</MainLayout>;
};
