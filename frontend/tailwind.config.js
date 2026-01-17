/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0056b3', // Deep Blue
                secondary: '#ffc107', // Amber/Yellow
            }
        },
    },
    plugins: [],
    theme: {
        extend: {
            colors: {
                primary: '#0056b3', // Deep Blue
                secondary: '#ffc107', // Amber/Yellow
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            }
        },
    },
}
