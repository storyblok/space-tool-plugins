import type { EventHandlerResponse, H3Event } from 'h3';
import type { AppSession } from '~/app-extension-auth';

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
