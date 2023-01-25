import React, { ReactNode, useCallback, useEffect } from 'react';
import { NextPageWithLayout } from './_app';
import MainLayout from '@/shared/layouts/main';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Home: NextPageWithLayout = () => {
  const supabase = useSupabaseClient();
  return <div>Home</div>;
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return <MainLayout title="Dashboard">{page}</MainLayout>;
};
