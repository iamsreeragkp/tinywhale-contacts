module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        baloo: 'Baloo',
        poppins: 'Poppins'
      },
      // bagroundColor:{
      //   primary-baground:"#12B5C1"
      // }
      textColor: {
        primaryFont: '#154F5B'
      },
      borderColor: {
        lightGrey: '#d6e1e3'
      },
      borderRadius: {
        '5': '1.25rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
