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
          'base-200': '#fff',
          'base-content': '#444E59',
        },
        business: {
          ...require('daisyui/src/colors/themes')['[data-theme=business]'],
          'base-100': '#111827',
        },
      },
    ],
  },
};
