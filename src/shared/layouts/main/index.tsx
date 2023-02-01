import classNames from 'classnames';
import { useTheme } from 'next-themes';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
import { RiMenuFoldFill } from 'react-icons/ri';
const MainSharedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { resolvedTheme, theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header
        className={classNames('h-20 wrapper shadow', {
          ['border-b border-b-gray-700']: theme === 'night',
        })}
      >
        <nav className="container mx-auto flex items-center justify-between h-full px-6 lg:px-0">
          <section className="left">Logo</section>
          <section className="right">
            {' '}
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
          </section>
        </nav>
      </header>
      <main className="flex-1 container mx-auto my-6 lg:my-10 px-6 lg:px-0">{children}</main>
      <footer
        className={classNames('h-24 wrapper shadow-lg border-t', {
          ['border-t border-t-gray-700']: theme === 'night',
        })}
      >
        <div className="flex items-center h-full container mx-auto px-6 lg:px-0">Footer</div>
      </footer>
    </div>
  );
};

export default MainSharedLayout;
