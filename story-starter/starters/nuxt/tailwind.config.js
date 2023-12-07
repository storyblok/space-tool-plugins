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

					info: '#395ece',
					success: '#2db47d',
					warning: '#ffac00',
					error: '#ff6159',

					'--rounded-box': '0.25rem',
					'--rounded-btn': '.25rem',
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
