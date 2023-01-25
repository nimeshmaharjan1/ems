import Head from 'next/head';
import React, { ReactNode, useState } from 'react';
import Sidebar from './sidebar';
import { Poppins } from '@next/font/google';
import { RiMenuFoldFill } from 'react-icons/ri';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import Header from './header';
import { useUser } from '@supabase/auth-helpers-react';
const poppins = Poppins({ weight: ['500', '300', '600', '700', '800'], subsets: ['latin'] });
const MainLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const userDetails = useUser();
  console.log(userDetails);
  return (
    <>
      <Head>
        <title>{title ? `${title} - EMS` : 'EMS'}</title>
      </Head>

      <div className={`flex ${poppins.className}`}>
        <Sidebar {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Sidebar>
        <section className="flex-1">
          <Header {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Header>
          <main className="p-6">{children}</main>
        </section>
      </div>
    </>
  );
};

export default MainLayout;
