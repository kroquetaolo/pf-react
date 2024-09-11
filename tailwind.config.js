/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/layouts/*.hbs",
    "./src/views/*.hbs",
    "./src/views/partials/*.hbs",
    "./src/views/profile/*.hbs",
    "./src/public/js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'nav': '#1a1a1a',
        'modal': '#000c',
      },
      boxShadow: {
        'navbar': '0px 3px 20px 3px rgba(255, 255, 255, 0.2)',
        // 'cart': ' 0px 0px 36px -7px rgba(255,160,0,0.75)'
      }
    },
  },
  plugins: [],
}

