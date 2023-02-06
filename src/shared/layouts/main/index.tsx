import { Poppins } from '@next/font/google';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import { RiMenuFoldFill } from 'react-icons/ri';
import MainSharedHeader from './header';
import MainSharedFooter from './footer';
import ShopByAside from './shop-by';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Breadcrumbs from './breadcrumbs';

import { GiHamburgerMenu } from 'react-icons/gi';
import { FaBox, FaLocationArrow, FaUser } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';

const poppins = Poppins({ weight: ['300', '400', '500', '600', '700', '800'], subsets: ['latin'] });
// const roboto = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ['latin'] });

const MainSharedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const { resolvedTheme, theme, setTheme } = useTheme();
  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isMounted) return null;

  return (
    <div className={`min-h-screen flex flex-col justify-between ${poppins.className}`}>
      <Head>
        <title>EMS</title>
      </Head>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="nav-wrapper bg-base-100 shadow">
            <div className="w-full navbar lg:container lg:mx-auto md:px-8 lg:px-28 gap-2">
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-sm btn-square btn-ghost">
                  <GiHamburgerMenu></GiHamburgerMenu>
                </label>
              </div>
              <div className="flex-1 text-xl font-bold text-primary">EMS</div>
              <div className="flex-none hidden lg:flex items-center gap-4">
                <button
                  onClick={() => {
                    resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
                  }}
                  className={classNames('!bg-transparent btn-sm !h-0 !p-0')}
                >
                  {resolvedTheme === 'corporate' ? (
                    <BsFillMoonFill className=" hover:text-primary duration-300"></BsFillMoonFill>
                  ) : (
                    <BsSun className="text-lg hover:text-amber-400 duration-300"></BsSun>
                  )}
                </button>
                <button className="btn btn-sm btn-ghost !normal-case !font-normal" onClick={() => router.push('/products')}>
                  Products
                </button>
                <button className="btn btn-sm btn-ghost !normal-case !font-normal">Contact</button>
                <button className="btn btn-sm btn-ghost !normal-case !font-normal">Sign In</button>
                <button className="btn btn-sm btn-primary !normal-case !font-normal">Sign Up</button>
              </div>
            </div>
          </div>
          <main className="flex-1 ">
            <div className="lg:container lg:mx-auto px-6  lg:px-28 my-6 md:my-12 md:mb-24 min-h-[calc(100vh-440px)]">{children}</div>

            <MainSharedFooter></MainSharedFooter>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 bg-base-100">
            <li>
              <a className="text-sm">
                <FaBox></FaBox>
                Products
              </a>
            </li>
            <li>
              <a className="text-sm">
                <FaLocationArrow />
                Contact
              </a>
            </li>
            <li>
              <a className="text-sm">
                <FaUser /> Account
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainSharedLayout;
