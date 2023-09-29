import { Inter, Public_Sans } from '@next/font/google';
import Head from 'next/head';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import MainSharedFooter from './footer';

import NavAvatarDropdown from '@/features/user/avatar-dropdown';
import UserProfileModal from '@/features/user/profile-modal';
import Cart from '@/shared/components/cart';
import ThemeToggler from '@/shared/components/theme-toggler';
import { Toast, showToast } from '@/shared/utils/toast.util';
import { useCartStore } from '@/store/user-cart';
import { USER_ROLES } from '@prisma/client';
import axios from 'axios';
import { BadgeInfo, Bug, LayoutGrid } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBox } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdLogin } from 'react-icons/md';

import classNames from 'classnames';
import { LogOut } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { BsBoxSeam, BsMailbox2 } from 'react-icons/bs';

const inter = Public_Sans({
  preload: false,
  fallback: ['system-ui'],
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const MainSharedLayout: React.FC<{
  children: ReactNode;
  metaData: { title?: string; description?: string; isHome?: boolean };
}> = ({ children, metaData: { title, description, isHome } }) => {
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
        <input aria-label="toggle drawer" id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="flex flex-col drawer-content">
          <div className="shadow nav-wrapper bg-base-100">
            <div className="!justify-between w-full gap-3 lg:px-12 h-[5rem] navbar lg:container lg:mx-auto !px-5">
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-sm btn-square btn-ghost">
                  <GiHamburgerMenu></GiHamburgerMenu>
                </label>
              </div>
              <Link href={'/'} passHref>
                <h2 className="text-xl font-semibold text-primary inline lg:hidden">EME</h2>
              </Link>
              <div className="items-center gap-x-6 hidden lg:flex flex-1">
                <Link href="/" className="text-2xl font-semibold text-primary">
                  EME
                </Link>
                <Link href="/products" className="btn btn-sm btn-ghost">
                  Products
                </Link>
                <Link href="/about" className="btn btn-sm btn-ghost">
                  About
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    if (!session) {
                      showToast(Toast.warning, 'Please login first.');
                      return signIn();
                    } else {
                      router.push('/raise-issue');
                    }
                  }}>
                  Issue Assistance
                </button>
              </div>
              <div className="flex items-center gap-3 lg:hidden theme">
                {router.pathname !== '/checkout' && (
                  <div className="mr-2">
                    <Cart></Cart>
                  </div>
                )}
                {status === 'authenticated' && <NavAvatarDropdown {...{ profileModalRef }} />}
                <ThemeToggler></ThemeToggler>
              </div>
              <div className="items-center flex-none hidden lg:gap-x-6 gap-4 lg:flex">
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
                {router.pathname !== '/checkout' && <Cart></Cart>}
                <div className="ml-0">
                  <ThemeToggler></ThemeToggler>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div
              className={classNames('', {
                'lg:container lg:mx-auto px-6 xl:px-12 my-6 md:my-10 md:mb-[6.6rem] min-h-[calc(100vh-440px)]': !isHome,
              })}>
              {children}
            </div>
            <MainSharedFooter></MainSharedFooter>
          </main>
        </div>
        <div className="drawer-side min-h-screen">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="w-64 h-full p-2 bg-base-100">
            <li>
              <Link href="/products" className="flex items-center gap-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                <BsBoxSeam className="text-lg"></BsBoxSeam>
                Products
              </Link>
            </li>
            {status === 'unauthenticated' && (
              <>
                <li className="-ml-[0.3rem]">
                  <Link
                    href="/api/auth/signin"
                    className="flex items-center gap-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                    <MdLogin className="text-lg" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                    <FiUserPlus />
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 pl-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                  <LayoutGrid />
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/raise-issue"
                className="flex items-center gap-2 pl-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                <Bug />
                Issue Assistance
              </Link>
            </li>
            <li>
              {' '}
              <Link
                href="/about"
                className="flex items-center gap-2 pl-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                <BadgeInfo />
                About
              </Link>
            </li>
            {status === 'authenticated' && (
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 pl-2 p-3 transition-all rounded-lg hover:bg-base-200 hover:text-primary">
                  <LogOut />
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainSharedLayout;
