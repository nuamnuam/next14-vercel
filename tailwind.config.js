/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

const { colors } = require('./src/designTokens/index');

const sectionPaddings = {
  smallDesktop: 50,
  smallMobile: 20,
  mediumDesktop: 80,
  mediumMobile: 30,
  largeDesktop: 150,
  largeMobile: 75,
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/types/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      rtl: true,
      center: true,
      padding: {
        DEFAULT: '1rem',
        '2xl': '3.75rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        body: ['iransansX'],
      },
      padding: {
        smallDesktop: `${sectionPaddings.smallDesktop}px`,
        smallMobile: `${sectionPaddings.smallMobile}px`,
        mediumDesktop: `${sectionPaddings.mediumDesktop}px`,
        mediumMobile: `${sectionPaddings.mediumMobile}px`,
        largeDesktop: `${sectionPaddings.largeDesktop}px`,
        largeMobile: `${sectionPaddings.largeMobile}px`,
      },
      // screens: {
      //   ...defaultTheme.screens,
      //   "3xl": "1900px",
      // },
      colors,
      fontSize: {
        xxs: ['0.6rem', { lineHeight: '0.9rem' }],
        '2xs': ['0.63rem', { lineHeight: '0.875rem' }],
        '3xs': ['0.5rem', { lineHeight: '0.75rem' }],
      },
      backgroundImage: {
        footer:
          'linear-gradient(180deg, rgba(246, 246, 246, 0.036) -6.41%, rgba(113, 113, 113, 0.3) 104.71%)',
        'gradient-1': 'linear-gradient(87deg, #0299F2 2.51%, #00DF9A 97.16%)',
        'gradient-2':
          'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)',
        'gradient-3':
          'linear-gradient(88deg, #2EA982 0%, rgba(61, 194, 153, 0.57) 100%)',
        'gradient-3-inverse':
          'linear-gradient(88deg, #2EA982 0%, rgba(61, 194, 153, 0.57) 100%)',
        'gradient-4':
          'linear-gradient(88deg, #2E7DA9 0%, rgba(61, 146, 194, 0.57) 100%)',
        'gradient-4-inverse':
          'linear-gradient(88deg, rgba(61, 146, 194, 0.57) 0%, #2E7DA9 100%)',
        'gradient-5':
          'linear-gradient(88deg, #8162D7 0%, rgba(94, 92, 200, 0.57) 100%)',
        'gradient-5-inverse':
          'linear-gradient(88deg, rgba(94, 92, 200, 0.57) 0%, #8162D7 100%)',
        'gradient-6':
          'linear-gradient(270deg, #9A9EB5 0%, rgba(242, 244, 250, 0.00) 100%)',
        'gradient-6-dark':
          'linear-gradient(270deg, #373B4F 0%, rgba(55, 59, 79, 0.00) 100%)',
        'gradient-primary': 'linear-gradient(270deg, #00DF9A 0%, #B0F5E0 100%)',
        'gradient-primary-dark':
          'linear-gradient(270deg, #009E6D 0%, #005E41 100%)',
      },
      boxShadow: {
        small: '0 2px 4px rgba(0, 0, 0, 0.08)',
        medium: '0px 3px 15px 0px rgba(55, 59, 79, 0.03)',
        large: '0px 4px 30px rgba(0, 0, 0, 0.15)',
        blur: '0px 0px 8px rgba(0, 0, 0, 0.15)',
        popover: '0px 0px 30px rgba(0, 0, 0, 0.1)',
        radio: '0px 3px 15px 0px rgba(55, 59, 79, 0.03)',
        card: '0px 3px 15px 0px rgba(55, 59, 79, 0.03)',
        button: '0px 3px 15px 0px rgba(55, 59, 79, 0.03)',
        counterIcon: '0px 0px 15px rgba(128, 133, 158, 0.15)',
      },
    },
  },
  variants: {
    aspectRatio: ['responsive', 'hover'],

    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),

    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
