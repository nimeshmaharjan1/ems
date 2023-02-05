import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsCart, BsFillMoonFill, BsSun } from 'react-icons/bs';
import styles from './header.module.scss';
const MainSharedHeader = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [isMounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isMounted) return null;
  return (
    <header
      className={classNames('wrapper shadow', {
        ['border-b border-b-gray-700']: theme === 'night',
      })}
    >
      <div className={`${styles['top-header-wrapper']} border-b ${theme === 'night' ? ' border-b-gray-700' : ''}`}>
        <section className="lg:container lg:mx-auto flex items-center justify-between h-10 px-6 lg:px-28">
          <section className="contact hidden md:flex">
            <p>Need Help ? 01-5203362</p>
            <div className="divider divider-horizontal"></div>
            <p>Contact</p>
          </section>
          <section className="account flex">
            <button
              onClick={() => {
                resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
              }}
              className={classNames('!bg-transparent btn-sm !h-0 !min-h-[2px] !p-0')}
            >
              {resolvedTheme === 'corporate' ? (
                <BsFillMoonFill className=" text-xs mt-[0.12rem] hover:text-primary duration-300"></BsFillMoonFill>
              ) : (
                <BsSun className="text-sm mt-[0.08rem] hover:text-amber-400 duration-300"></BsSun>
              )}
            </button>
            <div className="divider divider-horizontal"></div>
            <p>My account</p>
            <div className="divider divider-horizontal"></div>
            <p>Sign In</p>
          </section>
        </section>
      </div>
    </header>
  );
};

export default MainSharedHeader;
