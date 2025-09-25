/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define custom keyframes for the blob animation
      keyframes: {
        blob: {
          "0%, 100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
        },
      },
      // Define custom animation utilities
      animation: {
        blob: "blob 7s infinite",
      },
      // Optional: Add custom animation delays if you want utility classes like `animation-delay-2000`
      // Note: Tailwind doesn't include animation-delay utilities by default
      // So we add them manually under `extend`
      animationDelay: {
        '2000': '2s',
        '3000': '3s',
        // Add more if needed
      },
    },
  },
  plugins: [],
}