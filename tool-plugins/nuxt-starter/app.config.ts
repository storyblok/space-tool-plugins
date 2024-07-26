export default defineAppConfig({
	type: 'tool-plugin',
	appBridge: {
		enabled: true,
		oauth: true,
		origin: 'https://app.storyblok.com',
	},
});
