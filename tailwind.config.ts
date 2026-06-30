import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1D9E75",
          dark: "#0F6E56",
          light: "#E1F5EE",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-dm-serif)", "serif"],
      },
      borderRadius: {
        component: "8px",
        card: "12px",
      },
      borderWidth: {
        DEFAULT: "0.5px",
      },
      boxShadow: {
        card:     '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md':'0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        'glow-green': '0 4px 20px rgba(29,158,117,0.18)',
        'glow-amber': '0 4px 16px rgba(245,158,11,0.18)',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease both',
        'scale-in':   'scale-in 0.25s ease both',
        'pop':        'pop 0.3s ease both',
      },
    },
  },
  plugins: [],
};
export default config;
