import type { AppConfigInput } from 'nuxt/schema';
import { env } from './env';
import { AuthHandlerParams } from '~/app-extension-auth';
import { IncomingMessage, ServerResponse } from 'node:http';

export const AUTH_COOKIE_NAME = 'sb.auth';

const REGEXP_ESCAPE_CHARS_REGEXP = /[\^$\\.*+?()[\]{}|]/g;

const getPattern = (name: string) =>
	new RegExp(
		'(?:^|;) *' + name.replace(REGEXP_ESCAPE_CHARS_REGEXP, '\\$&') + '=([^;]*)',
	);
export const getAuthHandlerParams = (
	authConfig: AppConfigInput['auth'],
): AuthHandlerParams => ({
	clientId: env('CLIENT_ID'),
	clientSecret: env('CLIENT_SECRET'),
	baseUrl: env('BASE_URL'),
	successCallback: authConfig.successCallback,
	errorCallback: authConfig.errorCallback,
	endpointPrefix: authConfig.endpointPrefix,
	adapter: {
		getItem: ({
			req,
			res,
			key,
		}: {
			req: IncomingMessage;
			res: ServerResponse;
			key: string;
		}) => {
			const header = req.headers['cookie'];

			if (!header) {
				return undefined;
			}

			const match = header.match(getPattern(key));
			if (!match) {
				return undefined;
			}

			const value = match[1];
			if (value[0] === '"') {
				return value.slice(1, -1);
			}
			return value;
		},
		setItem: () => {},
		hasItem: () => {},
	},
});
