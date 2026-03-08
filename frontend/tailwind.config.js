/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'gov-navy':       '#0f2d52',
        'gov-navy-dark':  '#091e38',
        'gov-navy-light': '#1a4a7c',
        'gov-gold':       '#c9952a',
        'gov-gold-dark':  '#a87b1f',
        'gov-gold-light': '#e8b748',
      },
      fontFamily: {
        sans:  ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn:    'fadeIn 0.4s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
