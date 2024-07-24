export default defineAppConfig({
	type: 'space-plugin',
	appBridge: {
		enabled: false,
		oauth: true,
		origin: 'https://app.storyblok.com',
	},
	auth: {
		endpointPrefix: '/api/connect',
		initOauthFlowUrl: `/api/connect/storyblok`,
		successCallback: '/',
		errorCallback: '/401',
	},
});
