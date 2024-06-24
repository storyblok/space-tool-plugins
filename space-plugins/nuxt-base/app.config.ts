import type { AppBridgeConfig } from './types/appBridge';

export default defineAppConfig({
	appBridge: {
		type: 'space-plugin',
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

declare module '@nuxt/schema' {
	interface AppConfigInput {
		appBridge: AppBridgeConfig;
		auth: AuthConfig;
	}
}
