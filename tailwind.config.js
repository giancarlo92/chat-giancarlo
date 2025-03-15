/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Activamos el modo oscuro basado en clases
  theme: {
    extend: {
      colors: {
        primary: '#3245ff',
        secondary: '#bc52ee',
        'primary-dark': '#4f46e5', // indigo-600
        'secondary-dark': '#8b5cf6', // violet-500
      },
    },
  },
  plugins: [],
}
