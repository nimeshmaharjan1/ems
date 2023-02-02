import Head from 'next/head';
import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Roboto } from '@next/font/google';
import Header from './header';
import useWindowDimensions from '@/shared/hooks/use-dimensions.hook';

const roboto = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ['latin'] });

const AdminDashboardLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { height, width: innerWidth } = useWindowDimensions();
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

      <div className={`flex ${roboto.className}`}>
        <Sidebar {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Sidebar>
        <section className="flex-1">
          <div className="h-[70px]">
            <Header {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Header>
          </div>
          <main className="m-4 mx-8 mb-6 p-8 min-h-[calc(100vh-70px)] bg-base-200">{children}</main>
        </section>
      </div>
    </>
  );
};

export default AdminDashboardLayout;
