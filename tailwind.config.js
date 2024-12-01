/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#2d9cdb",
        secondary: "#27ae60",
        danger: "#e74c3c",
        warning: "#f2c94c",
        lrBlue: {
          100: "#9ae9ff",
          200: "#ccf4ff",
          300: "#207f99",
        },
        lrGreen: {
          100: "#9cffdc",
          200: "#ceffee",
          300: "#1b7a58",
        },
        lrRed: {
          100: "#ffa8a1",
          200: "#ffd4d0",
          300: "#a2332a",
        },
        lrYellow: {
          100: "#fff3a8",
          200: "#fff9d3",
          300: "#a99a35",
        },
      },
    },
  },
  plugins: [],
};
