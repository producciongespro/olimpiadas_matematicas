/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4a245f',
          accent: '#c64f23',
          highlight: '#f6b52c',
          soft: '#f8f2fa',
        },
        ink: '#273147',
        line: '#dfe3ea',
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        gallery: '0.75rem',
      },
      boxShadow: {
        header: '0 8px 30px rgb(24 12 32 / 16%)',
      },
    },
  },
}
