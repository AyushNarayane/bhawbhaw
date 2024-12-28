/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'baw-yellow': '#FFB315',
  			'baw-light': '#FFB315',
  			'baw-input': '#FFF6F4',
  			'baw-red': '#F47458',
  			'baw-baw-g4': '#C4B0A9',
  			'baw-baw-g6': '#F3EAE7',
  			'baw-baw-g5': '#D4C6C0',
  			'baw-baw-g3': '#85716B',
  			'baw-light-gray': '#00000080',
  			'baw-text': '#85716B',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        staatliches: ['Staatliches', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        kiwi: ['"Kiwi Maru"', 'serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
