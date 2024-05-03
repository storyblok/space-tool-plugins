// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	extends: [
		[
			'github:storyblok/space-tool-plugins/space-plugins/nuxt-base',
			{ install: true },
		],
		[
			'github:storyblok/space-tool-plugins/space-plugins/nuxt-base-ui',
			{ install: true },
		],
	],
	css: ['~/assets/css/base.css'],
	modules: ['nuxt-lucide-icons', '@nuxtjs/google-fonts', '@nuxtjs/tailwindcss'],
	googleFonts: {
		families: {
			Roboto: [300, 400, 500, 700],
		},
	},
});
