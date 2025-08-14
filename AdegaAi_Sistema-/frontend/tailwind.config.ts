
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cores personalizadas do tema verde-dourado
				green: {
					50: 'hsl(120 60% 97%)',
					100: 'hsl(120 55% 92%)',
					200: 'hsl(120 50% 86%)',
					300: 'hsl(120 45% 78%)',
					400: 'hsl(120 50% 65%)',
					500: 'hsl(120 61% 34%)',
					600: 'hsl(120 65% 28%)',
					700: 'hsl(120 70% 22%)',
					800: 'hsl(120 75% 16%)',
					900: 'hsl(120 80% 10%)'
				},
				amber: {
					50: 'hsl(48 100% 96%)',
					100: 'hsl(48 96% 89%)',
					200: 'hsl(48 97% 77%)',
					300: 'hsl(46 97% 65%)',
					400: 'hsl(43 96% 56%)',
					500: 'hsl(38 92% 50%)',
					600: 'hsl(32 95% 44%)',
					700: 'hsl(26 90% 37%)',
					800: 'hsl(23 83% 31%)',
					900: 'hsl(22 78% 26%)'
				},
				gold: {
					50: 'hsl(51 100% 96%)',
					100: 'hsl(51 96% 89%)',
					200: 'hsl(51 97% 77%)',
					300: 'hsl(48 97% 65%)',
					400: 'hsl(45 96% 56%)',
					500: 'hsl(42 92% 50%)',
					600: 'hsl(38 95% 44%)',
					700: 'hsl(34 90% 37%)',
					800: 'hsl(30 83% 31%)',
					900: 'hsl(27 78% 26%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
