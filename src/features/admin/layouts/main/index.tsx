import Head from 'next/head';
import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Roboto } from '@next/font/google';
import Header from './header';
import useWindowDimensions from '@/shared/hooks/use-dimensions.hook';
import { useRouter } from 'next/router';
import Link from 'next/link';

const roboto = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ['latin'] });

const AdminDashboardLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { height, width: innerWidth } = useWindowDimensions();
  useEffect(() => {
    if (innerWidth < 610) {
      setIsSidebarCollapsed(true);
    }
  }, [innerWidth]);

  const { pathname } = useRouter();
  const paths = pathname.split('/');

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
          <div className="text-sm breadcrumbs my-2 mt-3 mx-7">
            <ul>
              {paths.map((path, index) => {
                return (
                  <li key={path}>
                    <Link href={`/${index === 0 ? '' : '/'}${paths.slice(0, index + 1).join('/')}`}>
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <main className="m-4 mx-8 mb-6 !mt-3 p-8 py-6 min-h-[calc(100vh-70px)] bg-base-200">{children}</main>
        </section>
      </div>
    </>
  );
};

export default AdminDashboardLayout;
