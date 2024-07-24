import type { AppSession } from '@storyblok/app-extension-auth';

declare module 'h3' {
	interface H3EventContext {
		appSession: AppSession;
	}
}

declare module 'nuxt/schema' {
	interface AppConfigInput {
		type: PluginType;
		appBridge?: AppBridgeConfig;
		auth?: AuthConfig;
	}

	interface AppConfig {
		type: PluginType;
		appBridge: AppBridgeConfig;
		auth: AuthConfig;
	}
}

export default {};
