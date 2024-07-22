import type { AppBridgeConfig, PluginType } from './types/appBridge';

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

declare module '@nuxt/schema' {
	interface AppConfigInput {
		type: PluginType;
		appBridge: AppBridgeConfig;
		auth: AuthConfig;
	}
}
