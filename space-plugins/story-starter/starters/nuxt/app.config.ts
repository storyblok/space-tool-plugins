export default defineAppConfig({
	type: 'space-plugin',
	appBridge: {
		enabled: true,
		oauth: true,
		origin: 'https://app.storyblok.com',
	},
});
