import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#4A00C3",
        },
        secondary: {
          DEFAULT: "#00F4EF",
        },
        tertiary: {
          DEFAULT: "#F8F8F8",
          deep: "#171717",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        montserrat: ["var(--font-montserrat)"],
        lato: ["var(--font-lato)"],
      },
    },
  },
  plugins: [heroui()],
}