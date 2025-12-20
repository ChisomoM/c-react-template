/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {

          orange: '#F15A29',
        },
        secondary: {
          orange : '#172E70'
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
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        'myriad': ['Myriad Pro', 'system-ui', 'sans-serif'],
        'montserrat': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'outfit': ['Outfit', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'system-ui', 'monospace'],
      },
      // backgroundImage: {
      //   'orange-gradient': 'linear-gradient(to right, #D70F0E 0%, #E5600B 70%)',
      // },
      fontSize: {
        // Make text-6xl map to 56px with a sensible default line-height
        // so you can use `text-6xl` across the project.
        // Backwards-compatible alias if you prefer `text-titles`
        'titles': ['56px', { lineHeight: '1' }],
        'hero-title': ['56px', { lineHeight: '1.05' }],
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

