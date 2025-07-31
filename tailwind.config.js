module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: { 400: '#6366F1', 500: '#4F46E5' }, 
        emerald: { 300: '#6EE7B7', 400: '#34D399' },
      },
      backdropBlur: {
        xl: '24px', 
      },
    },
  },
  plugins: [], 
};
