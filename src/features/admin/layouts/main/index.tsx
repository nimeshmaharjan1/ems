import useWindowDimensions from '@/shared/hooks/use-dimensions.hook';
import { Inter, Work_Sans } from '@next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';

const inter = Inter({ preload: false, fallback: ['system-ui'], subsets: ['latin'], weight: ['200', '300', '400', '500', '600', '800'] });

// const inter = Work_Sans({ preload: true, subsets: ['latin'] });

const AdminDashboardLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
        <title>{title ? `${title} - EME` : 'EME'}</title>
      </Head>

      <div className={`${inter.className}`}>
        <Sidebar {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Sidebar>
        <section className="ml-[12rem]">
          <div className="h-[70px]">
            <Header></Header>
          </div>
          {/* <div className="my-2 mt-1 text-sm breadcrumbs mx-7">
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
          </div> */}
          <main className="p-8 py-6">{children}</main>
        </section>
      </div>
    </>
  );
};

export default AdminDashboardLayout;
