/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  theme: {
    container: {
      center: true,
    },
    extend: {
      screens: {
        xs: '290px',
        '2xl': '1400px', // Change the screen size name and width here
      },
    },
  },
  daisyui: {
    themes: [
      {
        winter: {
          ...require('daisyui/src/theming/themes')['[data-theme=winter]'],
          'base-200': '#F7F7F7',
          'base-300': '#F0F0F0',
          'base-content': '#444E59',
          accent: '#facc13',
        },
      },

      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          primary: '#057aff',
        },
      },
      // {
      //   night: {
      //     ...require('daisyui/src/theming/themes')['[data-theme=night]'],
      //     'base-200': '#0E1627',
      //     'base-300': '#0D1423',
      //   },
      // },
    ],
  },
};
