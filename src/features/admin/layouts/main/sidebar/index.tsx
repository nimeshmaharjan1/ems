import { DASHBOARD_LINKS } from '@/features/admin/enums';
import { default as classNames, default as classnames } from 'classnames';
import { PackageCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { FiBox, FiSettings } from 'react-icons/fi';
import { GoLocation } from 'react-icons/go';
import { HiOutlineUsers } from 'react-icons/hi2';

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isActive, setIsActive] = useState<string>(router.pathname);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <aside
      className={classnames(
        `sticky z-50 left-0 top-0 bottom-0 right-0 h-screen bg-base-100 shadow-lg duration-500 flex justify-between flex-col items-start px-2`,
        {
          ['w-[15.5rem]']: !isSidebarCollapsed,
          ['w-[4.2rem]']: isSidebarCollapsed,
        }
      )}>
      <div className="upper">
        <div
          onClick={() => {
            router.push('/products');
          }}
          className={classnames('logo cursor-pointer mt-4 relative gap-2 px-2', {
            'w-28 h-16  ml-4': !isSidebarCollapsed,
            'w-8 ml-2 h-6': isSidebarCollapsed,
          })}>
          <Image src="/logo.png" alt="logo" fill></Image>
          {/* <GoLocation className={classnames('text-primary text-2xl duration-1000')}></GoLocation>
          <h1
            className={classnames('text-primary font-bold text-xl', {
              hidden: isSidebarCollapsed,
            })}>
            EMS
          </h1> */}
        </div>
        {/* <div
          className={classnames('search-section flex items-center gap-2 rounded-md mt-6 bg-base-200 py-2 duration-1000', {
            'pl-3 mr-3': !isSidebarCollapsed,
            'justify-center w-10 px-2 ml-1': isSidebarCollapsed,
          })}
          onClick={() => setIsSidebarCollapsed(false)}>
          <BsSearch
            className={classnames('block float-left cursor-text  mb-[0.15rem] duration-1000', {
              'mr-1': !isSidebarCollapsed,
            })}></BsSearch>
          <input
            type="search"
            placeholder="Search"
            className={classnames('outline-none duration-1000 text-base-content bg-transparent w-[180px]  focus:outline-none', {
              hidden: isSidebarCollapsed,
            })}
          />
        </div> */}
        <ul
          className={classNames('pt-3 w-full pl-1 pr-6', {
            ['w-[15.5rem]']: !isSidebarCollapsed,
          })}>
          {/* <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
                'active-nav-link': isActive === DASHBOARD_LINKS.dashboard,
              }
            )}
            onClick={() => {
              setIsActive(DASHBOARD_LINKS.dashboard);
              router.push(DASHBOARD_LINKS.dashboard);
            }}>
            <span className="block float-left text-2xl">
              <RxDashboard></RxDashboard>
            </span>
            <span className={`font-normal text-sm  flex-1 ${isSidebarCollapsed && 'hidden'}`}>Dashboard</span>
          </li> */}
          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
                'active-nav-link': isActive === DASHBOARD_LINKS.products,
              }
            )}
            onClick={() => {
              setIsActive(DASHBOARD_LINKS.products);
              router.push(DASHBOARD_LINKS.products);
            }}>
            <span className="block float-left text-2xl">
              <FiBox></FiBox>
            </span>
            <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Products</span>
          </li>
          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
                'active-nav-link': isActive === DASHBOARD_LINKS.users,
              }
            )}
            onClick={() => {
              setIsActive(DASHBOARD_LINKS.users);
              router.push(DASHBOARD_LINKS.users);
            }}>
            <span className="block float-left text-2xl">
              <HiOutlineUsers></HiOutlineUsers>
            </span>
            <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Users</span>
          </li>
          {/* <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
                'active-nav-link': isActive === DASHBOARD_LINKS.myProfile,
              }
            )}
            onClick={() => {
              setIsActive(DASHBOARD_LINKS.myProfile);
              router.push(DASHBOARD_LINKS.myProfile);
            }}>
            <span className="block float-left text-2xl">
              <ImProfile></ImProfile>
            </span>
            <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>My Profile</span>
          </li> */}
          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
                'active-nav-link': isActive === DASHBOARD_LINKS.orders,
              }
            )}
            onClick={() => {
              setIsActive(DASHBOARD_LINKS.orders);
              router.push(DASHBOARD_LINKS.orders);
            }}>
            <span className="block float-left text-2xl">
              <PackageCheck />
            </span>
            <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Orders</span>
          </li>
          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
                'active-nav-link': isActive === DASHBOARD_LINKS.settings,
              }
            )}
            onClick={() => {
              setIsActive(DASHBOARD_LINKS.settings);
              router.push(DASHBOARD_LINKS.settings);
            }}>
            <span className="block float-left text-2xl">
              <FiSettings></FiSettings>
            </span>
            <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Settings</span>
          </li>
        </ul>
      </div>
      <div
        className={classNames('actions mb-6 flex items-center', {
          ['w-[15.5rem]']: isSidebarCollapsed,
        })}>
        <div
          onClick={() => {
            signOut({ callbackUrl: '/products' });
          }}
          className={classnames(
            'ml-2 text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md ',
            {
              ['w-10']: isSidebarCollapsed,
              ['p-3']: !isSidebarCollapsed,
            }
          )}>
          <span className="block float-left text-2xl">
            <AiOutlineLogout></AiOutlineLogout>
          </span>
          <span className={`font-normal text-sm flex-1 ${isSidebarCollapsed && 'hidden'}`}>Logout</span>
        </div>
      </div>
    </aside>
  );
}
