import { Inter, Poppins } from '@next/font/google';
import Head from 'next/head';
import React, { ReactNode, useEffect, useState } from 'react';
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
  const [isAdmin, setIsAdmin] = useState(session?.user?.role === USER_ROLES.SUPER_ADMIN || session?.user?.role === USER_ROLES.ADMIN);
  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setIsAdmin(session?.user?.role === USER_ROLES.SUPER_ADMIN || session?.user?.role === USER_ROLES.ADMIN);
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
  if (!isMounted) return null;

  return (
    <div className={`min-h-screen flex flex-col justify-between ${inter.className}`}>
      <Head>
        <title>{title ? `EMS - ${title}` : 'EMS'}</title>
        <meta
          name="description"
          content={description ? description : 'Check out new products listed from various vendors all around Nepal.'}
        />
      </Head>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="nav-wrapper bg-base-200 shadow">
            <div className="w-full navbar lg:container lg:mx-auto md:px-8 lg:px-28 gap-2">
              <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-sm btn-square btn-ghost">
                  <GiHamburgerMenu></GiHamburgerMenu>
                </label>
              </div>
              <div className="flex-1 text-xl font-bold text-primary">EMS</div>
              <div className="flex items-center lg:hidden theme mx-4">
                {router.pathname !== '/checkout' && <Cart></Cart>}
                <ThemeToggler></ThemeToggler>
              </div>
              <div className="flex-none hidden lg:flex items-center gap-4">
                <Link href="/products" className="btn btn-sm btn-ghost">
                  Products
                </Link>
                {session?.user?.role === USER_ROLES.SUPER_ADMIN && (
                  <Link href="/admin/products" className="btn btn-sm btn-ghost ">
                    Dashboard
                  </Link>
                )}
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
                {status === 'authenticated' && (
                  <div className="dropdown dropdown-end !mr-3">
                    <label tabIndex={0} className="btn btn-sm btn-ghost btn-circle avatar">
                      {session?.user?.image ? (
                        <div className="avatar online">
                          <div className="w-8 h-8 rounded-full shadow">
                            <Image src={session?.user?.image} height={500} width={500} alt="user" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <User />
                          {/* <Image src="/icons/default-user.png" height={500} width={500} alt="user" /> */}
                          {/* <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                            <span className="text-xs">{session?.user?.username.charAt(0).toUpperCase()}</span>
                          </div> */}
                        </>
                      )}
                    </label>
                    <ul tabIndex={0} className="z-50 menu menu-compact dropdown-content mt-3 shadow-md bg-base-100 rounded-box w-52">
                      {isAdmin && (
                        <li>
                          <Link href="/admin/products">
                            <RxDashboard></RxDashboard>
                            Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <a>
                          <AiOutlineUser></AiOutlineUser>
                          Profile
                        </a>
                      </li>
                      <li>
                        <a>
                          <GiSettingsKnobs></GiSettingsKnobs>Settings
                        </a>
                      </li>
                      <li onClick={() => signOut({ callbackUrl: '/products' })}>
                        <a>
                          <AiOutlineLogout></AiOutlineLogout>Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
                <div className="-ml-1">
                  <ThemeToggler></ThemeToggler>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 ">
            <div className="lg:container lg:mx-auto px-6 lg:px-28 my-6 md:my-12 md:mb-[6.6rem] min-h-[calc(100vh-440px)]">{children}</div>
            <MainSharedFooter></MainSharedFooter>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu gap-y-1 p-4 w-64 bg-base-100 h-screen">
            <li>
              <Link href="/products" className="text-sm">
                <FaBox></FaBox>
                Products
              </Link>
            </li>
            {status === 'unauthenticated' && (
              <>
                <li className="-ml-[0.3rem]">
                  <Link href="/api/auth/signin" className="text-sm">
                    <MdLogin className="text-lg" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-sm">
                    <FiUserPlus />
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li>
                <Link href="/admin/products" className="text-sm">
                  <RxDashboard></RxDashboard>
                  Dashboard
                </Link>
              </li>
            )}
            {status === 'authenticated' && (
              <>
                <li className="text-sm" onClick={() => signOut()}>
                  <a>
                    <MdLogout className="text-lg" />
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
