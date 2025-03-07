/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ Enables class-based dark mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html", // ✅ Fix invalid glob pattern
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
