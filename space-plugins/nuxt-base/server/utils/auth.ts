import type { AppConfigInput } from 'nuxt/schema';
import { env } from './env';
import { AuthHandlerParams } from '~/app-extension-auth';

export const AUTH_COOKIE_NAME = 'sb.auth';

export const getAuthHandlerParams = (
	authConfig: AppConfigInput['auth'],
): AuthHandlerParams => ({
	clientId: env('CLIENT_ID'),
	clientSecret: env('CLIENT_SECRET'),
	baseUrl: env('BASE_URL'),
	successCallback: authConfig.successCallback,
	errorCallback: authConfig.errorCallback,
	endpointPrefix: authConfig.endpointPrefix,
});
