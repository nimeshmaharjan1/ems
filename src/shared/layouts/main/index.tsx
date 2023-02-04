import { Roboto } from '@next/font/google';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import { RiMenuFoldFill } from 'react-icons/ri';
import MainSharedHeader from './header';
import MainSharedFooter from './footer';
import ShopByAside from './shop-by';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Breadcrumbs from './breadcrumbs';

// const poppins = Roboto({ weight: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] });
const roboto = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ['latin'] });

const MainSharedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <div className={`min-h-screen flex flex-col justify-between ${roboto.className}`}>
      <Head>
        <title>EMS</title>
      </Head>
      <MainSharedHeader></MainSharedHeader>
      <main className="flex-1 lg:container lg:mx-auto my-6 px-6 lg:px-28">
        <Breadcrumbs slug={router.query.slug as string}></Breadcrumbs>
        {children}
      </main>
      <MainSharedFooter></MainSharedFooter>
    </div>
  );
};

export default MainSharedLayout;
