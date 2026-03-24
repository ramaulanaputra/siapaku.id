import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: { blue: '#2563EB', tan: '#D4A574', cream: '#FFF8F0', dark: '#1E293B' },
        squad: {
          analis: '#8B5CF6', diplomat: '#10B981',
          sentinel: '#3B82F6', explorer: '#F59E0B'
        }
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] }
    }
  },
  plugins: []
}
export default config
