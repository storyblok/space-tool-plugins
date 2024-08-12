// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	extends: [
		[
			'github:storyblok/space-tool-plugins/space-plugins/nuxt-base',
			{ install: true },
		],
	],
	css: ['~/assets/css/main.css'],
	modules: ['nuxt-lucide-icons', '@nuxtjs/google-fonts', '@nuxtjs/tailwindcss'],
	googleFonts: {
		families: {
			Roboto: [300, 400, 700],
		},
	},
});
