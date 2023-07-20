import React from 'react';
import { NextPageWithLayout } from './_app';
import MainSharedLayout from '@/shared/layouts/main';

const Home: NextPageWithLayout = () => {
  return <div>Home</div>;
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
