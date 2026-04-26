/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg:    '#0d0c18',  // page background
          card:  '#1e1b33',  // card / panel background
          inner: '#252442',  // nested card (answer box)
          muted: '#2a2847',  // subtle dividers / hover states
        },
      },
    },
  },
  plugins: [],
}
