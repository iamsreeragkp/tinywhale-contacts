module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        scale: 'scale 1s infinite ease-in-out',
        'spin-fast': 'spin 1s infinite ease-in-out',
      },
      keyframes: {
        scale: {
          from: {
            transform: 'scale(1.2)',
          },
          to: {
            transform: 'scale(1.2)',
          },
          '50%': {
            transform: 'scale(1)',
          },
        },
      },
      fontFamily: {
        baloo: 'Baloo',
        poppins: 'Poppins',
        montserrat: 'Montserrat',
      },
      fontSize: {
        tworem: '2rem',
        fourtyPx: '40px',
      },
      borderRadius: {
        5: '1.25rem',
      },
      width: {
        90: '22.5rem',
      },
      height: {
        68: '17rem',
      },
      colors: {
        primaryBlue: '#00a4b7',
        veryLightGray: '#f1f4f5',
        lightGrey: '#d6e1e3',
        mediumGray: '#73959d',
        primaryFont: '#154F5B',
        secondaryBlue: '#00a4b7',
        veryDarkGray: 'rgb(21, 79, 91)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
