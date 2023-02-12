import { Inter, Poppins } from '@next/font/google';
import React, { ReactNode, useEffect, useState } from 'react';
import MainSharedFooter from './footer';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { GiHamburgerMenu, GiSettingsKnobs } from 'react-icons/gi';
import { FaBox, FaLocationArrow, FaUser } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import { USER_ROLES } from '@prisma/client';
import ThemeToggler from '@/shared/components/theme-toggler';
import Image from 'next/image';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import Link from 'next/link';

const inter = Inter({ preload: false, fallback: ['system-ui'], subsets: ['latin'], weight: ['200', '300', '400', '500', '600', '800'] });

const MainSharedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(session?.user?.role === USER_ROLES.SUPER_ADMIN || session?.user?.role === USER_ROLES.ADMIN);
  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setIsAdmin(session?.user?.role === USER_ROLES.SUPER_ADMIN || session?.user?.role === USER_ROLES.ADMIN);
  }, [session?.user?.role]);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen flex flex-col justify-between ${inter.className}`}>
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
              <div className="block md:hidden theme mx-4">
                <ThemeToggler></ThemeToggler>
              </div>
              <div className="flex-none hidden lg:flex items-center gap-3">
                <button className="btn btn-sm btn-ghost !normal-case" onClick={() => router.push('/products')}>
                  Products
                </button>
                <button className="btn btn-sm btn-ghost !normal-case">Contact</button>
                {isAdmin && (
                  <button className="btn btn-sm btn-ghost !normal-case" onClick={() => router.push('/admin/dashboard')}>
                    Dashboard
                  </button>
                )}
                {status === 'unauthenticated' && (
                  <>
                    <button
                      className="btn btn-sm btn-ghost !normal-case"
                      onClick={() => {
                        router.push('/api/auth/signin');
                      }}
                    >
                      Sign In
                    </button>
                    <button className="btn btn-sm btn-primary !normal-case">Sign Up</button>
                  </>
                )}
                {status === 'authenticated' && (
                  <div className="dropdown dropdown-end !-ml-0">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                      {session?.user?.image ? (
                        <div className="avatar online">
                          <div className="w-8 h-8 rounded-full bg-primary">
                            <Image src="/icons/default-user.png" className="p-1" height={500} width={500} alt="user" />
                          </div>
                        </div>
                      ) : (
                        <div className="avatar placeholder online">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                            <span className="text-xs">{session?.user?.username.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                      )}
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 shadow-md bg-base-100 rounded-box w-52">
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
                      <li onClick={() => signOut({ redirect: false })}>
                        <a>
                          <AiOutlineLogout></AiOutlineLogout>Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
                <div className="!ml-1">
                  <ThemeToggler></ThemeToggler>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 ">
            <div className="lg:container lg:mx-auto px-6 lg:px-28 my-6 md:my-12 md:mb-24 min-h-[calc(100vh-440px)]">{children}</div>
            <MainSharedFooter></MainSharedFooter>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 bg-base-100">
            <li>
              <Link href="/admin/dashboard" className="text-sm">
                <FaBox></FaBox>
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="text-sm">
                <FaLocationArrow />
                Contact
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="text-sm">
                <FaUser /> Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainSharedLayout;
