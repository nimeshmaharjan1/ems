/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],

  daisyui: {
    themes: [
      {
        corporate: {
          ...require('daisyui/src/colors/themes')['[data-theme=corporate]'],
          'base-200': '#F7F7F7',
          'base-300': '#F0F0F0',
          'base-content': '#444E59',
        },
      },
      'night',
    ],
  },
};
