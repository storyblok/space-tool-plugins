module.exports = {
	root: true,
	extends: ['@nuxt/eslint-config', 'plugin:vuejs-accessibility/recommended'],
	rules: {
		'vue/html-indent': 'off',
		'vue/max-attributes-per-line': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/html-self-closing': 'off',
	},
};
