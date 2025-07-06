/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './constants/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { // 밴놀 디자인 시스템 커스텀
    extend: {
      fontFamily: {
        pretendard: ['Pretendard'],
        'pretendard-semibold': ['Pretendard-SemiBold'],
        'pretendard-bold': ['Pretendard-Bold'],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          900: '#121212',
          800: '#1F1F1F',
          700: '#333333',
          600: '#555555',
          500: '#7C7C7C',
          400: '#B3B3B3',
          300: '#D0D0D0',
          200: '#EAEAEA',
          100: '#FAFAFA',
        },
        point: '#FB4932',
      },
    },
  },
  plugins: [],
};