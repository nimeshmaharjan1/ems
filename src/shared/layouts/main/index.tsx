import { Inter, Poppins } from '@next/font/google';
import Head from 'next/head';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import MainSharedFooter from './footer';

import Cart from '@/shared/components/cart';
import ThemeToggler from '@/shared/components/theme-toggler';
import { useCartStore } from '@/store/user-cart';
import { USER_ROLES } from '@prisma/client';
import { User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { FaBox } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { GiHamburgerMenu, GiSettingsKnobs } from 'react-icons/gi';
import { MdLogin, MdLogout } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { useRouter } from 'next/router';
import UserProfileModal from '@/features/user/profile-modal';
import NavAvatarDropdown from '@/features/user/avatar-dropdown';

const inter = Inter({
  preload: false,
  fallback: ['system-ui'],
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

// const work = Poppins({ preload: true, subsets: ['latin'], weight: ['200', '300', '400', '500', '600', '700', '800'] });
// const work = Nunito({ subsets: ['latin'] });

const MainSharedLayout: React.FC<{ children: ReactNode; metaData: { title?: string; description?: string } }> = ({
  children,
  metaData: { title, description },
}) => {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(session?.user?.role === USER_ROLES.SUPER_ADMIN || session?.user?.role === USER_ROLES.STAFF);
  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setIsAdmin(session?.user?.role === USER_ROLES.SUPER_ADMIN || session?.user?.role === USER_ROLES.STAFF);
  }, [session?.user?.role]);

  const { setCartItems } = useCartStore();

  useEffect(() => {
    if (window.localStorage) {
      const cartItems = localStorage.getItem('cartItems');
      if (cartItems) {
        setCartItems(JSON.parse(cartItems));
      }
    }
  }, [setCartItems]);

  const router = useRouter();
  const profileModalRef = useRef<HTMLDialogElement>(null);
  if (!isMounted) return null;

  return (
    <div className={`min-h-screen flex flex-col justify-between ${inter.className}`}>
      <Head>
        <title>{title ? `EME - ${title}` : 'EME'}</title>
        <meta
          name="description"
          content={description ? description : 'Check out new products listed from various vendors all around Nepal.'}
        />
      </Head>
      {session?.user?.id && <UserProfileModal ref={profileModalRef}></UserProfileModal>}
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="nav-wrapper bg-base-100 shadow-lg">
            <div className="w-full navbar lg:container h-20 lg:mx-auto md:px-8 lg:px-28 gap-2">
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-sm btn-square btn-ghost">
                  <GiHamburgerMenu></GiHamburgerMenu>
                </label>
              </div>
              <div className="flex-1">
                <Link href="/products" className="relative w-24 h-12 md:w-28 md:h-14">
                  <Image src="/logo.jpeg" fill alt="logo"></Image>
                </Link>
              </div>
              <div className="flex items-center lg:hidden theme mx-4 gap-2">
                {router.pathname !== '/checkout' && <Cart></Cart>}
                {status === 'authenticated' && <NavAvatarDropdown {...{ profileModalRef }} />}
                <ThemeToggler></ThemeToggler>
              </div>
              <div className="flex-none hidden lg:flex items-center gap-4">
                <Link href="/products" className="btn btn-sm btn-ghost">
                  Products
                </Link>
                {/* {session?.user?.role === USER_ROLES.SUPER_ADMIN && (
                  <Link href="/admin/products" className="btn btn-sm btn-ghost ">
                    Dashboard
                  </Link>
                )} */}

                {router.pathname !== '/checkout' && <Cart></Cart>}
                {/* <button className="btn btn-sm btn-ghost ">Contact</button> */}

                {status === 'unauthenticated' && (
                  <>
                    <Link className="btn btn-sm btn-ghost " href="/api/auth/signin">
                      Sign In
                    </Link>
                    <Link href="/auth/register" className="btn btn-sm btn-primary ">
                      Sign Up
                    </Link>
                  </>
                )}
                {status === 'authenticated' && <NavAvatarDropdown {...{ profileModalRef }} />}
                <div className="-ml-1">
                  <ThemeToggler></ThemeToggler>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 ">
            <div className="lg:container lg:mx-auto px-6 lg:px-28 my-6 md:my-10 md:mb-[6.6rem] min-h-[calc(100vh-440px)]">{children}</div>
            <MainSharedFooter></MainSharedFooter>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className=" p-2 w-64 bg-base-100 h-full">
            <li>
              <Link
                href="/products"
                className="text-sm flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary">
                <FaBox></FaBox>
                Products
              </Link>
            </li>
            {status === 'unauthenticated' && (
              <>
                <li className="-ml-[0.3rem]">
                  <Link
                    href="/api/auth/signin"
                    className="text-sm flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary">
                    <MdLogin className="text-lg" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="text-sm flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary">
                    <FiUserPlus />
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link
                  href="/admin/products"
                  className="text-sm flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary">
                  <RxDashboard></RxDashboard>
                  Dashboard
                </Link>
              </li>
            )}
            {status === 'authenticated' && (
              <>
                <li className="text-sm cursor-pointer" onClick={() => signOut()}>
                  <a className="flex items-center p-2 rounded-lg gap-2 hover:bg-base-200 transition-all hover:text-primary">
                    <MdLogout className="text-lg " />
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainSharedLayout;
