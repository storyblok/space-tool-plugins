import type { AppSession } from '@storyblok/app-extension-auth';

declare module 'h3' {
	interface H3EventContext {
		appSession: AppSession;
	}
}

declare module 'nuxt/schema' {
	// We can have both `AppConfigInput` and `AppConfig`.
	// - `AppConfigInput`: what user provides
	// - `AppConfig`: what we actually get from `useAppConfig()`
	// Nuxt merges the app configs from all the layers,
	// allowing us to have optional properties at `AppConfigInput`.
	//
	// ref: https://nuxt.com/docs/guide/directory-structure/app-config#typing-app-config
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
