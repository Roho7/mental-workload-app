/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aquamarine: {
          50: "#ebfef5",
          100: "#cffce6",
          200: "#a4f6d1",
          300: "#57eab2",
          400: "#2dda9e",
          500: "#09c086",
          600: "#009c6d",
          700: "#007d5b",
          800: "#02634a",
          900: "#03513d",
          950: "#002e24",
        },
      },
    },
  },
  plugins: [],
};
