import { Toast, showToast } from '@/shared/utils/toast.util';
import { supabase } from '@/supabase';
import { GetServerSideProps, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

const Home = () => {
  const router = useRouter();
  const getUser = useCallback(async () => {
    const session = await supabase.auth.getSession();
    const user = await supabase.auth.getUser();
    if (!session.data.session) {
      showToast(Toast.error, 'Unauthorized');
      router.push('/auth/login');
    }
    console.log({ session });
    console.log({ user });
  }, [router]);
  useEffect(() => {
    getUser();
  }, [getUser]);
  return <div>Home</div>;
};

export default Home;

// Home.getInitialProps = async (ctx: NextPageContext) => {
//   if (ctx) {
//     ctx?.res?.writeHead(302, {
//       Location: '/auth/login',
//     });
//     ctx?.res?.end();
//   }

//   return {};
// };
