import Head from 'next/head';
import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Poppins } from '@next/font/google';
import Header from './header';
import { useUser } from '@supabase/auth-helpers-react';
import useWindowDimensions from '@/shared/hooks/use-dimensions.hook';

const poppins = Poppins({ weight: ['500', '300', '400', '600', '700', '800'], subsets: ['latin'] });

const MainLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { height, width: innerWidth } = useWindowDimensions();
  const userDetails = useUser();
  useEffect(() => {
    if (innerWidth < 610) {
      setIsSidebarCollapsed(true);
    }
  }, [innerWidth]);
  return (
    <>
      <Head>
        <title>{title ? `${title} - EMS` : 'EMS'}</title>
      </Head>

      <div className={`flex ${poppins.className}`}>
        <Sidebar {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Sidebar>
        <section className="flex-1">
          <div className="h-[70px]">
            <Header {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Header>
          </div>
          <main className="m-4 mx-5 p-8 py-5 md:container md:mx-auto min-h-[calc(100vh-70px)] bg-base-200">{children}</main>
        </section>
      </div>
    </>
  );
};

export default MainLayout;
