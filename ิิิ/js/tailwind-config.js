tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Kanit', 'Poppins', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#0f0c29',
                    purple: '#302b63',
                    teal: '#24243e',
                    accent: '#00f260',
                    accent2: '#0575E6',
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(50px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    }
}
