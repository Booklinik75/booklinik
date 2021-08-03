module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ["Circular", "Montserrat", "sans-serif"],
      mono: [
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    extend: {
      colors: {
        shamrock: "#33C383",
        bali: "#80A0AB",
      },
      outline: {
        shamrock: "2px solid #33C383",
        bali: "2px solid #80A0AB",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
