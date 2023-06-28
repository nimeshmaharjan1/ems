import ThemeToggler from '@/shared/components/theme-toggler';
import classNames from 'classnames';
import { User } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { RiMenuFoldFill } from 'react-icons/ri';

const Header: React.FC<{
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  return (
    <header className="z-50 flex items-center justify-end w-full h-16 px-12 border-b shadow border-b-base-300 bg-base-100 gap-x-3">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <User></User>
        </label>
        <ul tabIndex={0} className="mt-1 z-[1] p-2 shadow-lg bg-base-200 menu space-y-1 dropdown-content rounded-box w-52">
          <li>
            <a>Profile</a>
          </li>
          <li>
            <a>Sign Out</a>
          </li>
        </ul>
      </div>
      <ThemeToggler></ThemeToggler>
    </header>
  );
};

export default Header;
