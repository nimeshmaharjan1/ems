import { AiOutlineLogout } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import { BsSearch } from 'react-icons/bs';
import { HiOutlineUsers } from 'react-icons/hi2';
import { ImProfile } from 'react-icons/im';
import { FiBox, FiSettings } from 'react-icons/fi';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { RxDashboard } from 'react-icons/rx';

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <aside
      className={classnames(
        `sticky z-50 left-0 top-0 bottom-0 right-0 h-screen bg-base-200 shadow-lg duration-500 flex justify-between flex-col items-start px-2`,
        {
          ['w-[17.5rem]']: !isSidebarCollapsed,
          ['w-[4.2rem]']: isSidebarCollapsed,
        }
      )}
    >
      <div className="upper">
        <div
          className={classnames('logo flex items-center mt-6 gap-2 px-2 ml-1', {
            'ml-2': !isSidebarCollapsed,
          })}
        >
          <GoLocation className={classnames('text-primary text-2xl duration-1000')}></GoLocation>
          <h1
            className={classnames('text-primary font-bold text-xl', {
              hidden: isSidebarCollapsed,
            })}
          >
            Melon
          </h1>
        </div>
        <div
          className={classnames('search-section flex items-center gap-2 rounded-md mt-6 bg-base-300 py-2 duration-1000', {
            'px-3 ml-3': !isSidebarCollapsed,
            'justify-center w-10 px-2 ml-1': isSidebarCollapsed,
          })}
          onClick={() => setIsSidebarCollapsed(false)}
        >
          <BsSearch
            className={classnames('block float-left cursor-text  mb-[0.15rem] duration-1000', {
              'mr-1': !isSidebarCollapsed,
            })}
          ></BsSearch>
          <input
            type="search"
            placeholder="Search"
            className={classnames('outline-none duration-1000 text-base-content bg-transparent w-[180px]  focus:outline-none', {
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
              <RxDashboard></RxDashboard>
            </span>
            <span className={`font-medium  flex-1 ${isSidebarCollapsed && 'hidden'}`}>Dashboard</span>
          </li>
          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
              }
            )}
            onClick={() => router.push('/admin/products')}
          >
            <span className="text-2xl block float-left">
              <FiBox></FiBox>
            </span>
            <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Products</span>
          </li>
          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
              }
            )}
            onClick={() => router.push('/admin/products')}
          >
            <span className="text-2xl block float-left">
              <HiOutlineUsers></HiOutlineUsers>
            </span>
            <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Users</span>
          </li>
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
          </li>

          <li
            className={classnames(
              'text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md mt-2',
              {
                ['w-10']: isSidebarCollapsed,
                ['p-3']: !isSidebarCollapsed,
              }
            )}
            onClick={() => router.push('/admin/settings')}
          >
            <span className="text-2xl block float-left">
              <FiSettings></FiSettings>
            </span>
            <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Settings</span>
          </li>
        </ul>
      </div>
      <div className="actions mb-6 flex items-center">
        <div
          className={classnames(
            'ml-2 text-base-content duration-300 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-secondary hover:text-base-100 rounded-md ',
            {
              ['w-10']: isSidebarCollapsed,
              ['p-3']: !isSidebarCollapsed,
            }
          )}
        >
          <span className="text-2xl block float-left">
            <AiOutlineLogout></AiOutlineLogout>
          </span>
          <span className={`font-medium flex-1 ${isSidebarCollapsed && 'hidden'}`}>Logout</span>
        </div>
      </div>
    </aside>
  );
}
