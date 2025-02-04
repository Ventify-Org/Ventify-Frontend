// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust path as needed
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // 'Roboto' is your font name, 'sans-serif' is a fallback
      },
    },
  },
  plugins: [],
};
