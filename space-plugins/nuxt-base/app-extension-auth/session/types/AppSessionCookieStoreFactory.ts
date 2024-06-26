import http from 'http';
import type { AuthHandlerParams } from '../../storyblok-auth-api';
import type { AppSessionStore } from './AppSessionStore';

export type AppSessionCookieStoreFactoryParams = Pick<
	AuthHandlerParams,
	| 'clientId'
	| 'cookieName'
	| 'clientSecret'
	| 'baseUrl'
	| 'endpointPrefix'
	| 'adapter'
>;

export type AppSessionCookieStoreFactory = (
	staticParams: AppSessionCookieStoreFactoryParams,
) => (requestParams: {
	req: http.IncomingMessage;
	res: http.ServerResponse;
}) => AppSessionStore;
