export default defineAppConfig({
	appBridge: {
		type: 'space-plugin',
		enabled: true,
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
