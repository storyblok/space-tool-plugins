import { type AuthHandlerParams } from '@storyblok/app-extension-auth';
import { env } from '~/server/utils/env';
import { ENDPOINT_PREFIX } from '~/shared/auth';

export const authHandlerParams: AuthHandlerParams = {
	clientId: env('CLIENT_ID'),
	clientSecret: env('CLIENT_SECRET'),
	baseUrl: env('BASE_URL'),
	successCallback: '/',
	errorCallback: '/401',
	endpointPrefix: ENDPOINT_PREFIX,
};
