module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.{html,ts}']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // bagroundColor:{
      //   primary-baground:"#12B5C1"
      // }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
