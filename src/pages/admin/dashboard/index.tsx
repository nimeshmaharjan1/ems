import Head from 'next/head';
import Image from 'next/image';
import { Poppins } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import { BsSearch, BsFillMoonFill, BsSun } from 'react-icons/bs';
import { RiDashboardFill } from 'react-icons/ri';
import { ImProfile } from 'react-icons/im';
import { FiSettings } from 'react-icons/fi';
import { MdAccessTime } from 'react-icons/md';
import { ImBooks } from 'react-icons/im';
import { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useTheme } from 'next-themes';
const workSans = Poppins({ weight: ['500', '300', '600', '700', '800'], subsets: ['latin'] });

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <>
      <div className={`flex ${workSans.className}`}>
        <aside
          className={classnames(`h-screen bg-base-200 shadow-lg relative duration-500 flex flex-col items-start px-2`, {
            ['w-[17.5rem]']: !isSidebarCollapsed,
            ['w-[4.2rem]']: isSidebarCollapsed,
          })}
        >
          <div
            className="border-2 p-1 shadow-lg bg-base-200 rounded-full border-base-300 hover:border-primary cursor-pointer hover:scale-105 duration-300  absolute -right-4 bottom-20"
            onClick={() => {
              setIsSidebarCollapsed((prev) => !prev);
            }}
          >
            <AiOutlineArrowLeft
              className={classnames(`text-secondary text-lg duration-300`, {
                ['rotate-180']: isSidebarCollapsed,
              })}
            ></AiOutlineArrowLeft>
          </div>
          <div className={classnames('logo flex items-center mt-6 gap-2 px-2')}>
            <GoLocation className={classnames('text-primary text-2xl duration-1000')}></GoLocation>
            <h1
              className={classnames('text-primary font-bold text-xl duration-300', {
                ['scale-0']: isSidebarCollapsed,
              })}
            >
              Melon
            </h1>
          </div>
          <div
            className={classnames('search-section flex items-center gap-2 rounded-md mt-6 bg-base-300 ml-1 py-2 duration-1000', {
              'px-3': !isSidebarCollapsed,
              'px-2': isSidebarCollapsed,
            })}
            onClick={() => setIsSidebarCollapsed(false)}
          >
            <BsSearch
              className={classnames('text-primary block float-left cursor-text  mb-[0.15rem] duration-1000', {
                'mr-1': !isSidebarCollapsed,
              })}
            ></BsSearch>
            <input
              type="search"
              placeholder="Search"
              className={classnames('outline-none duration-1000 text-base-content bg-transparent w-full  focus:outline-none', {
                hidden: isSidebarCollapsed,
              })}
            />
          </div>
          <ul className="pt-3 w-full pl-1 pr-6">
            <li
              className={classnames(
                'text-base-content duration-300 flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
                {
                  ['w-10']: isSidebarCollapsed,
                  ['p-3']: !isSidebarCollapsed,
                }
              )}
            >
              <span className="text-2xl block float-left">
                <RiDashboardFill></RiDashboardFill>
              </span>
              <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Dashboard</span>
            </li>{' '}
            <li
              className={classnames(
                'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
                {
                  ['w-10']: isSidebarCollapsed,
                  ['p-3']: !isSidebarCollapsed,
                }
              )}
            >
              <span className="text-2xl block float-left">
                <ImProfile></ImProfile>
              </span>
              <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>My Profile</span>
            </li>{' '}
            <li
              className={classnames(
                'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
                {
                  ['w-10']: isSidebarCollapsed,
                  ['p-3']: !isSidebarCollapsed,
                }
              )}
            >
              <span className="text-2xl block float-left">
                <MdAccessTime></MdAccessTime>
              </span>
              <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Time Log</span>
            </li>{' '}
            <li
              className={classnames(
                'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
                {
                  ['w-10']: isSidebarCollapsed,
                  ['p-3']: !isSidebarCollapsed,
                }
              )}
            >
              <span className="text-2xl block float-left">
                <FiSettings></FiSettings>
              </span>
              <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Settings</span>
            </li>{' '}
            <li
              className={classnames(
                'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
                {
                  ['w-10']: isSidebarCollapsed,
                  ['p-3']: !isSidebarCollapsed,
                }
              )}
            >
              <span className="text-2xl block float-left">
                <ImBooks></ImBooks>
              </span>
              <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Projects</span>
            </li>
            <li
              onClick={() => {
                resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
              }}
              className={classnames(
                'text-base-content duration-300 flex items-center gap-x-3 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
                {
                  ['w-10']: isSidebarCollapsed,
                  ['p-3']: !isSidebarCollapsed,
                }
              )}
            >
              <span className="text-2xl block float-left">
                {resolvedTheme === 'corporate' ? <BsFillMoonFill></BsFillMoonFill> : <BsSun className="text-[20px]"></BsSun>}
              </span>
              <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>
                {resolvedTheme === 'corporate' ? 'Dark' : 'Light'}
              </span>
            </li>
          </ul>
        </aside>
        <main className="px-6 py-[1.5rem]">
          <h1 className="font-bold text-2xl flex-1">Dashboard</h1>
        </main>
      </div>
    </>
  );
}
