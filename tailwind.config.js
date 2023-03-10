/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'node_modules/daisyui/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  theme: {
    container: {
      center: true,
    },
  },
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
