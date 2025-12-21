/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#212A48',
          orange: '#E5600B',
        },
        secondary: {
          orange : '#D70F0E'
        },
        gradient: {
          from: '#D70F0E',
          to: '#E5600B',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground' : 'hsl(var(--sidebar-accent))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        }
      },
      fontFamily: {
        'myriad': ['Myriad Pro', 'system-ui', 'sans-serif'],
        'montserrat': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'outfit': ['Outfit', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'system-ui', 'monospace'],
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(to right, #D70F0E 0%, #E5600B 70%)',
      },
      fontSize: {
        'hero-title': '92px',
        'hero-subtitle': '16px',
        'stats-number': '36px',
        'stats-label': '20px',
        'nav-text': '16px',
      },
      spacing: {
        'hero-top': '200px',
      }
    },
  },
  plugins: [],
}

