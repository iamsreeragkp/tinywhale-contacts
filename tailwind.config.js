module.exports = {
  purge: ['./src/**/*.{html,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        baloo: 'Baloo',
        poppins: 'Poppins',
      },
      // bagroundColor:{
      //   primary-baground:"#12B5C1"
      // }
      textColor: {
        primaryFont: '#154F5B',
        secondaryBlue: '#00a4b7',
        mediumGray: '#73959d',
      },
      borderColor: {
        lightGrey: '#d6e1e3',
      },
      borderRadius: {
        5: '1.25rem',
      },
      width: {
        90: '22.5rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
