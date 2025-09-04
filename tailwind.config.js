/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        'brand-purple': '#8B5CF6', // A more saturated purple
        'brand-purple-light': '#A78BFA', // Lighter purple for hover
        'light-1': '#F3F4F6', // Inputs/light bg elements: Neutral light gray
        'light-2': '#FFFFFF', // Cards: White
        'light-3': '#E5E7EB', // Borders: Soft gray
        'dark-1': '#111827',  // Dark mode bg: Very dark gray
        'dark-2': '#1F2937',  // Dark mode cards: Dark gray
        'dark-3': '#4B5563',  // Borders/muted text: Muted gray
        'white': '#FFFFFF',
        'dark': {
          '1': '#111827', // text on light bg
          '2': '#374151', // secondary text
          '3': '#6B7280', // muted text
        },
        'light': {
          '1': '#F9FAFB', // main text on dark bg
          '2': '#D1D5DB', // secondary text
          '3': '#9CA3AF', // muted text
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 15px #8B5CF6, 0 0 30px #8B5CF6',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px #A78BFA, 0 0 50px #A78BFA',
          },
        }
      }
    }
  },
  plugins: [],
}