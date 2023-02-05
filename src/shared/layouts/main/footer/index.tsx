import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTheme } from 'next-themes';

const MainSharedFooter = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <footer
      className={classNames('h-24 wrapper shadow-lg border-t mt-10', {
        ['border-t border-t-gray-700']: theme === 'business',
      })}
    >
      <div className="flex items-center h-full lg:container lg:mx-auto px-6 lg:px-28">Footer</div>
    </footer>
  );
};

export default MainSharedFooter;
