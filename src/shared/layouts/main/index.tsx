import Head from 'next/head';
import React, { ReactNode, useState } from 'react';
import Sidebar from './sidebar';
import { Poppins } from '@next/font/google';
import { RiMenuFoldFill } from 'react-icons/ri';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
const poppins = Poppins({ weight: ['500', '300', '600', '700', '800'], subsets: ['latin'] });
const MainLayout: React.FC<{ children: ReactNode; title?: string }> = ({ children, title }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <Head>
        <title>{title ? `${title} - EMS` : 'EMS'}</title>
      </Head>

      <div className={`flex ${poppins.className}`}>
        <Sidebar {...{ setIsSidebarCollapsed, isSidebarCollapsed }}></Sidebar>
        <section className="flex-1">
          <header className="h-[4.2rem] flex justify-between items-center bg-base-200 w-full shadow px-6">
            <div
              className=" p-1 cursor-pointer  duration-300"
              onClick={() => {
                setIsSidebarCollapsed((prev) => !prev);
              }}
            >
              <RiMenuFoldFill
                className={classNames(`text-secondary text-xl duration-300`, {
                  ['rotate-180']: isSidebarCollapsed,
                })}
              ></RiMenuFoldFill>
            </div>
            <button
              onClick={() => {
                resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
              }}
              className={classNames('!bg-transparent btn-sm')}
            >
              {resolvedTheme === 'corporate' ? (
                <BsFillMoonFill className="text-lg hover:text-primary duration-300"></BsFillMoonFill>
              ) : (
                <BsSun className="text-2xl hover:text-amber-400 duration-300"></BsSun>
              )}
            </button>
          </header>
          <main className="p-6">{children}</main>
        </section>
      </div>
    </>
  );
};

export default MainLayout;
