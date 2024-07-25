import type { AuthHandlerParams } from '@storyblok/app-extension-auth';
import type { AppConfig } from 'nuxt/schema';

export const getAuthHandlerParams = (
	authConfig: AppConfig['auth'],
): AuthHandlerParams => ({
	clientId: env('CLIENT_ID'),
	clientSecret: env('CLIENT_SECRET'),
	baseUrl: env('BASE_URL'),
	successCallback: authConfig.successCallback,
	errorCallback: authConfig.errorCallback,
	endpointPrefix: authConfig.endpointPrefix,
});
