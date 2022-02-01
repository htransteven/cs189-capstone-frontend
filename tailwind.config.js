const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      green: colors.emerald,
      yellow: colors.amber,
      purple: colors.violet,
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
