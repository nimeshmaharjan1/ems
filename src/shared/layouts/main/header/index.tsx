import classNames from 'classnames';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';
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
          <section className="contact flex">
            <p>Need Help ? 01-5203362</p>
            <div className="divider divider-horizontal"></div>
            <p>Contact</p>
          </section>
          <section className="account flex">
            <p>My account</p>
            <div className="divider divider-horizontal"></div>
            <p>Sign In</p>
          </section>
        </section>
      </div>
      <nav className="lg:container lg:mx-auto flex items-center justify-between h-20 px-6 lg:px-28">
        <section className="left">
          <h1 className="text-2xl font-bold text-primary">EMS</h1>
        </section>
        <section className="right flex items-center gap-6">
          {' '}
          <button
            onClick={() => {
              resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
            }}
            className={classNames('!bg-transparent btn-sm mb-[0.1rem] !p-0')}
          >
            {resolvedTheme === 'corporate' ? (
              <BsFillMoonFill className="text-lg hover:text-primary duration-300"></BsFillMoonFill>
            ) : (
              <BsSun className="text-2xl hover:text-amber-400 duration-300"></BsSun>
            )}
          </button>
          <button className="btn btn-primary btn-sm !normal-case !font-normal">Shopping Cart</button>
        </section>
      </nav>
    </header>
  );
};

export default MainSharedHeader;
