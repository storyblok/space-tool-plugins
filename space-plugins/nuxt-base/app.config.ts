import type { AppSession } from '@storyblok/app-extension-auth';
import type { H3Event } from 'h3';

export default defineAppConfig({
	auth: {
		endpointPrefix: '/api/connect',
		initOauthFlowUrl: `/api/connect/storyblok`,
		successCallback: '/',
		errorCallback: '/401',
	},
});

declare module '@nuxt/schema' {
	interface AppConfigInput {
		auth: {
			endpointPrefix: string;
			initOauthFlowUrl: string;
			successCallback: string;
			errorCallback: string;
			middleware?: {
				ignoredPaths?: string[]; //e.g.: ['/api/endpoint']
				afterAuth?: (context: {
					event: H3Event;
					appSession: AppSession;
				}) => void;
			};
		};
	}
}
