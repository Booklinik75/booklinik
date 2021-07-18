module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
    extend: {
      colors: {
        shamrock: "#33C383",
        bali: "#80A0AB",
      },
      fontFamily: {
        hand: ["Lancaste"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
