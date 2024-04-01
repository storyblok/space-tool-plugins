import type { AppSession } from '@storyblok/app-extension-auth';
import type { EventHandlerResponse, H3Event } from 'h3';

export type AuthConfig = {
	endpointPrefix: string;
	initOauthFlowUrl: string;
	successCallback: string;
	errorCallback: string;
	middleware?: MiddlewareConfig;
};

export type MiddlewareConfig = {
	ignoredPaths?: string[]; //e.g.: ['/api/endpoint']
	afterAuthenticated?: (params: {
		event: H3Event;
		appSession: AppSession;
	}) => EventHandlerResponse | Promise<EventHandlerResponse> | undefined;
};
