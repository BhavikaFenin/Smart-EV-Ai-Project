/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f9f0",
          100: "#c2f0da",
          400: "#22c07d",
          500: "#0fa968",
          600: "#0b8a54",
          700: "#086b41",
        },
        accent: {
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
