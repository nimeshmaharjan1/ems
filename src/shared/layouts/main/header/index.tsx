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
        ['border-b border-b-gray-700']: theme === 'business',
      })}
    >
      <div className={`${styles['top-header-wrapper']} border-b ${theme === 'business' ? ' border-b-gray-700' : ''}`}>
        <section className="lg:container lg:mx-auto flex items-center justify-between h-10 px-6 lg:px-28">
          <section className="contact flex">
            <p>Need Help ? 01-5203362</p>
            <div className="divider divider-horizontal"></div>
            <p>Contact</p>
          </section>
          <section className="account flex">
            <button
              onClick={() => {
                resolvedTheme === 'corporate' ? setTheme('business') : setTheme('corporate');
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
      <section className="logo-section lg:container lg:mx-auto flex items-center justify-between h-20 px-6 lg:px-28">
        <section className="left">
          <h1 className="text-2xl font-bold text-primary">EMS</h1>
        </section>

        <section className="right flex items-center gap-4">
          <button className="btn btn-ghost btn-sm">Products</button>
          <button className="btn btn-ghost btn-sm">New Arrivals</button>
          <button className="btn btn-ghost btn-sm">Festival Offers</button>
          <div className="dropdown dropdown-hover dropdown-end">
            <label tabIndex={0} className="btn btn-primary btn-sm !normal-case !font-normal !items-center gap-1">
              <BsCart></BsCart>
              <span className="mt-[0.1rem]">Cart - 0 items</span>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52 ">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </section>
      </section>
    </header>
  );
};

export default MainSharedHeader;
