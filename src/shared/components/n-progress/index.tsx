import React from 'react';

//@ts-ignore
import daisyuiColors from 'daisyui/src/theming/themes';
import NextNProgress from 'nextjs-progressbar';
import { useTheme } from 'next-themes';

const NProgressProvider = () => {
  const { theme } = useTheme();
  return (
    <NextNProgress
      options={{ showSpinner: false }}
      color={theme === 'winter' ? daisyuiColors['[data-theme=winter]'].primary : daisyuiColors['[data-theme=dark]'].primary}
      height={4}
    />
  );
};

export default NProgressProvider;
