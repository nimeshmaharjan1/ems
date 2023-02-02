import { Roboto } from '@next/font/google';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import { RiMenuFoldFill } from 'react-icons/ri';
import MainSharedHeader from './header';
import MainSharedFooter from './footer';
import ShopByAside from './shop-by';

// const poppins = Roboto({ weight: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] });
const roboto = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ['latin'] });

const MainSharedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={`min-h-screen flex flex-col justify-between ${roboto.className}`}>
      <MainSharedHeader></MainSharedHeader>
      <main className="flex-1 lg:container lg:mx-auto my-6 md:my-12 px-6 lg:px-28">
        <div className="grid grid-cols-6 gap-8 relative gap-x-12">
          <div className="col-span-6 md:col-span-2">
            <ShopByAside></ShopByAside>
          </div>
          <div className="col-span-6 md:col-span-4">{children}</div>
        </div>
      </main>
      <MainSharedFooter></MainSharedFooter>
    </div>
  );
};

export default MainSharedLayout;
