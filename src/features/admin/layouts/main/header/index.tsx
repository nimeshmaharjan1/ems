import ThemeToggler from '@/shared/components/theme-toggler';
import classNames from 'classnames';
import { User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { RiMenuFoldFill } from 'react-icons/ri';

const getRoute = (route: string): string => {
  return route.slice(7);
};

const Header: React.FC<{
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const router = useRouter();
  return (
    <header className="z-50 flex items-center justify-between w-full h-16 px-8 border-b border-b-base-300 bg-base-100 gap-x-3">
      <h3 className="text-2xl font-semibold capitalize">{getRoute(router.pathname)}</h3>
      <section className="flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <User></User>
          </label>
          <ul tabIndex={0} className="mt-1 z-[1] p-2 shadow-lg bg-base-200 menu space-y-1 dropdown-content rounded-box w-52">
            <li>
              <a>Profile</a>
            </li>
            <li onClick={() => signOut()}>
              <a>Sign Out</a>
            </li>
          </ul>
        </div>
        <ThemeToggler></ThemeToggler>
      </section>
    </header>
  );
};

export default Header;
