import { Inter, Poppins, Work_Sans } from '@next/font/google';
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
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import Combobox from '@/shared/components/combobox';
import { useInfiniteQuery } from 'react-query';
import { getAllProducts } from '@/features/admin/services/products/products.service';

import { useInView } from 'react-intersection-observer';
import Drawer from '@/shared/components/drawer';

const inter = Inter({
  preload: false,
  fallback: ['system-ui'],
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

// const inter = Work_Sans({ preload: true, subsets: ['latin'] });
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
  const [isFromNoPhoneNumber, setIsFromNoPhoneNumber] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get(`/api/users/${session?.user?.id}`);
      if (!response.data?.user) {
        signOut();
        return;
      }
      if (response.data.user?.phone_number) {
        return;
      } else {
        setTimeout(() => {
          showToast(Toast.warning, 'Please add your phone number.');
          setIsFromNoPhoneNumber(true);
          profileModalRef.current?.show();
        }, 10000);
      }
    };
    if (session) {
      getUserData();
    }
  }, [session]);

  const { ref, inView } = useInView();
  const limit = 10;
  const [searchKeyword, setSearchKeyword] = useState('');

  // const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
  //   'getAllProducts',
  //   ({ pageParam = 1 }) => getAllProducts({ page: pageParam, limit, searchKeyword }),
  //   {
  //     getNextPageParam: (lastPage, allPages) => {
  //       const nextPage = lastPage.length === limit ? allPages.length + 1 : undefined;
  //       return nextPage;
  //     },
  //   }
  // );

  // useEffect(() => {
  //   if (inView && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, fetchNextPage, hasNextPage]);

  const [isOpen, setIsOpen] = useState(false);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen flex flex-col justify-between scroll-smooth antialiased ${inter.className}`}>
      <Head>
        <title>{title ? `EME - ${title}` : 'EME'}</title>
        <meta
          name="description"
          content={description ? description : 'Check out new products listed from various vendors all around Nepal.'}
        />
      </Head>
      {session?.user?.id && (
        <UserProfileModal
          setIsFromNoPhoneNumber={setIsFromNoPhoneNumber}
          isFromNoPhoneNumber={isFromNoPhoneNumber}
          ref={profileModalRef}></UserProfileModal>
      )}
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="flex flex-col drawer-content">
          <div className="shadow nav-wrapper bg-base-100">
            <div className="justify-between w-full gap-3 h-26 navbar lg:container lg:mx-auto md:px-8 lg:px-28">
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-sm btn-square btn-ghost">
                  <GiHamburgerMenu></GiHamburgerMenu>
                </label>
              </div>
              <div className="">
                <Link href="/products" className="relative w-[5.5rem] mb-1 h-14 md:w-[7.5rem] md:h-20">
                  <Image src="/logo.png" fill alt="logo"></Image>
                </Link>
              </div>
              <div className="flex items-center gap-2 lg:hidden theme">
                {router.pathname !== '/checkout' && <Cart></Cart>}
                {status === 'authenticated' && <NavAvatarDropdown {...{ profileModalRef }} />}
                {/* <ThemeToggler></ThemeToggler> */}
              </div>
              <div className="items-center flex-none hidden gap-4 lg:flex">
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
                <ThemeToggler></ThemeToggler>
                {status === 'authenticated' && <NavAvatarDropdown {...{ profileModalRef }} />}
                <div className="-ml-1">{/* <ThemeToggler></ThemeToggler> */}</div>
              </div>
            </div>
          </div>

          <main className="flex-1 ">
            <div className="lg:container lg:mx-auto px-6 lg:px-28 my-6 md:my-10 md:mb-[6.6rem] min-h-[calc(100vh-440px)] ">
              {/* <div className="mb-6">
                <Combobox
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  ref={ref}
                  results={data}
                  isSuccess={isSuccess}></Combobox>
              </div> */}
              <button className="btn" onClick={() => setIsOpen(!isOpen)}>
                Hello
              </button>
              <Drawer setIsOpen={setIsOpen} isOpen={isOpen}>
                <div>Hello</div>
              </Drawer>
              {children}
            </div>
            <MainSharedFooter></MainSharedFooter>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="w-64 h-full p-2 bg-base-100">
            <li>
              <Link
                href="/products"
                className="flex items-center gap-2 p-2 text-sm transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                <FaBox></FaBox>
                Products
              </Link>
            </li>
            {status === 'unauthenticated' && (
              <>
                <li className="-ml-[0.3rem]">
                  <Link
                    href="/api/auth/signin"
                    className="flex items-center gap-2 p-2 text-sm transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                    <MdLogin className="text-lg" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 p-2 text-sm transition-all rounded-lg hover:bg-base-200 hover:text-primary">
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
                  className="flex items-center gap-2 p-2 text-sm transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                  <RxDashboard></RxDashboard>
                  Dashboard
                </Link>
              </li>
            )}
            {status === 'authenticated' && (
              <>
                <li className="text-sm cursor-pointer" onClick={() => signOut()}>
                  <a className="flex items-center gap-2 p-2 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
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
