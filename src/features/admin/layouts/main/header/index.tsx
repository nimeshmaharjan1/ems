import classNames from 'classnames';
import { useTheme } from 'next-themes';
import React, { Dispatch, SetStateAction } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import { RiMenuFoldFill } from 'react-icons/ri';

const Header: React.FC<{
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}> = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <header className="z-50 h-[4.2rem] flex justify-between items-center bg-base-100 w-full shadow px-6">
      <button
        className=" p-1 cursor-pointer  duration-300"
        onClick={() => {
          setIsSidebarCollapsed((prev) => !prev);
        }}>
        <RiMenuFoldFill
          className={classNames(` text-xl `, {
            ['rotate-180']: isSidebarCollapsed,
          })}></RiMenuFoldFill>
      </button>
      {/* <button
        onClick={() => {
          resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
        }}
        className={classNames('!bg-transparent btn-sm')}>
        {resolvedTheme === 'corporate' ? (
          <BsFillMoonFill className="text-lg hover:text-primary duration-300"></BsFillMoonFill>
        ) : (
          <BsSun className="text-2xl hover:text-amber-400 duration-300"></BsSun>
        )}
      </button> */}
    </header>
  );
};

export default Header;
