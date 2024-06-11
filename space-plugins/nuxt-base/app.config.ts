import type { AppBridgeConfig } from './types/appBridge';

export default defineAppConfig({
	appBridge: {
		auth: false,
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
