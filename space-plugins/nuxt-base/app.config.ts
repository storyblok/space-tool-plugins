import type { AppBridgeConfig } from './types/appBridge';

export default defineAppConfig({
	appBridge: {
		enabled: true,
		// enabled: false,
		oauth: true,
		origin: 'http://localhost:3300',
		// origin: 'https://app.storyblok.com',
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
