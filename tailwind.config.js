/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          light: "#FBF0E4",
          neutral: "#ABAD8A",
          green: "#82A33D"
        }
      }
    },
  },
  plugins: [],
}

