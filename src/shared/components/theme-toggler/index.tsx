import classNames from 'classnames';
import { useTheme } from 'next-themes';
import React from 'react';
import { BsFillMoonFill, BsSun } from 'react-icons/bs';

const ThemeToggler = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        resolvedTheme === 'corporate' ? setTheme('night') : setTheme('corporate');
      }}
      className={classNames('!bg-transparent btn-sm !h-0 !p-2 mb-1')}>
      {resolvedTheme === 'corporate' ? (
        <BsFillMoonFill className=" hover:text-primary duration-300 h-5 w-5"></BsFillMoonFill>
      ) : (
        <BsSun className="text-lg hover:text-amber-400 duration-300 h-5 w-5"></BsSun>
      )}
    </button>
  );
};

export default ThemeToggler;
