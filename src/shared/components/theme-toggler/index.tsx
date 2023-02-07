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
      className={classNames('!bg-transparent btn-sm !h-0 !p-0')}
    >
      {resolvedTheme === 'corporate' ? (
        <BsFillMoonFill className=" hover:text-primary duration-300"></BsFillMoonFill>
      ) : (
        <BsSun className="text-lg hover:text-amber-400 duration-300"></BsSun>
      )}
    </button>
  );
};

export default ThemeToggler;
