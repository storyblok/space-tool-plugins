import { createConfigForNuxt } from '@nuxt/eslint-config';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

// extends: ['@nuxt/eslint-config', 'plugin:vuejs-accessibility/recommended'],
export default createConfigForNuxt().append([
	...pluginVueA11y.configs['flat/recommended'],
	{
		rules: {
			'vue/html-indent': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/multi-word-component-names': 'off',
			'vue/html-self-closing': 'off',
		},
	},
]);
