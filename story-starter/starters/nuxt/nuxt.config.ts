// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	modules: ['nuxt-lucide-icons', '@nuxtjs/google-fonts'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	googleFonts: {
		families: {
			Roboto: [300, 400, 700],
		},
	},
});
