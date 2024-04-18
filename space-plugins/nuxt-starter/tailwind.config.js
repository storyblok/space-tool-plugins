/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Roboto, sans-serif'],
			},
			colors: {
				teal: {
					25: '#D9F4F3',
					50: '#7FD9D7',
					75: '#40C6C4',
					100: '#00B3B0',
				},
				ink: {
					10: '#F7F8F9',
					15: '#DBDDE2',
					25: '#C6C8CF',
					50: '#8D919F',
					70: '#6A728A',
					75: '#545B6F',
					100: '#1B243F',
				},
				'info-dark': '#395ECE',
				'success-dark': '#2DB47D',
				'warning-dark': '#FABD25',
				'error-dark': '#FF6159',
				'info-light': '#C8D9F5',
				'success-light': '#B2E8CB',
				'warning-light': '#FCD867',
				'error-light': '#FFCAC7',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				Storyblok: {
					primary: '#00b3b0',
					'primary-focus': '#009f9c',
					'primary-content': '#ffffff',

					secondary: '#1b243f',
					'secondary-focus': '#545b6f',
					'secondary-content': '#ffffff',

					accent: '#00b3b0',
					'accent-focus': '#009f9c',
					'accent-content': '#ffffff',

					neutral: '#f9f9f9',
					'neutral-focus': '#eff1f3',
					'neutral-content': '#1b243f',

					'base-100': '#f9f9f9',
					'base-200': '#eff1f3',
					'base-300': '#ced3d9',
					'base-content': '#1b243f',

					info: '#F1F5FD',
					success: '#D7F4E3',
					warning: '#FFF4D5',
					error: '#FFF2F1',

					'--rounded-box': '0.25rem',
					'--rounded-btn': '0.5rem',
					'--rounded-badge': '1.9rem',

					'--animation-btn': '.25s',
					'--animation-input': '.2s',

					'--btn-text-case': 'normal-case',
					'--btn-focus-scale': '0.99',
					'--border-btn': '1px',
					'--tab-border': '1px',
					'--tab-radius': '0.5rem',
				},
			},
		],
	},
};
