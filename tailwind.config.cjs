/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            palette: {
               black: "#252422",
               teal: "#5B7B7A",
               blue: "#51A3A3",
               crimson: "#A61E30",
               white: "#FFFFFF",
            },
            brophy: {
               100: "#F28F9C",
               200: "#E37382",
               300: "#D45A6A",
               400: "#C54455",
               500: "#B53041",
               600: "#A61E30",
               700: "#8B2432",
               800: "#702630",
               900: "#55242B",
               1000: "#3A1D21",
               1100: "#0D0809",
               DEFAULT: "#A61E30",
            },
         },
      },
   },
   plugins: [],
};
