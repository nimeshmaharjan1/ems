import React, { ReactNode, useCallback, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/features/admin/layouts/main';

const Home: NextPageWithLayout = () => {
  const supabase = useSupabaseClient();
  return <div>Home</div>;
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return <MainLayout title="Dashboard">{page}</MainLayout>;
};
