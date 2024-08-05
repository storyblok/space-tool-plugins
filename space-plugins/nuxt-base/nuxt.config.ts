// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
