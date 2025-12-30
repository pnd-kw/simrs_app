/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    screens: {
      // mobile: { raw: "(min-width: 300px) and (max-width: 500px)" },
      hd: "720px",
      fhd: "1900px",
    },
  },
};
export const plugins = [];
