// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-04-10',
	devtools: { enabled: true },
	nitro: {
		imports: {
			dirs: ['./types', './utils', './server/utils'],
		},
	},
	imports: {
		dirs: ['./types', './utils'],
	},
});