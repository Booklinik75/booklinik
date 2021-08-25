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
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.20rem",
      "2xl": "1.3rem",
      "3xl": "1.5rem",
      "4xl": "1.875rem",
      "5xl": "2.875rem",
      "6xl": "3.875rem",
      "7xl": "4.875rem",
    },
    maxHeight: {
      192: "44rem",
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
  plugins: [require("@tailwindcss/line-clamp")],
};
