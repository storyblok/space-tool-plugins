import type { AppConfigInput } from 'nuxt/schema';
import { env } from './env';
import { Adapter, AuthHandlerParams } from '~/app-extension-auth';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const AUTH_COOKIE_NAME = 'sb.auth';

const REGEXP_ESCAPE_CHARS_REGEXP = /[\^$\\.*+?()[\]{}|]/g;

const getPattern = (name: string) =>
	new RegExp(
		'(?:^|;) *' + name.replace(REGEXP_ESCAPE_CHARS_REGEXP, '\\$&') + '=([^;]*)',
	);

const withCookie = (
	headers: string[],
	name: string,
	value: string,
): string[] => [
	...headers.filter((header) => !header.startsWith(`${name}=`)),
	changedCookieHeaderValue(name, value),
];

const cookieHeaders = (res: ServerResponse): string[] => {
	const header = res.getHeader('Set-Cookie');
	if (typeof header === 'undefined') {
		return [];
	}
	if (typeof header == 'number') {
		return [header.toString(10)];
	}
	if (typeof header == 'string') {
		return [header];
	}
	return header;
};

const changedCookieHeaderValue = (name: string, value: string) =>
	`${name}=${value}; path=/; samesite=none; secure; httponly; partitioned;`;

const expiredCookieHeaderValue = (name: string) =>
	`${name}=""; path=/; samesite=none; secure; httponly; expires=Thu, 01 Jan 1970 00:00:00 GMT; partitioned;`;

const withExpiredCookie = (headers: string[], name: string): string[] => [
	...headers.filter((header) => !header.startsWith(`${name}=`)),
	expiredCookieHeaderValue(name),
];

import jwt from 'jsonwebtoken';

export const verifyData = (secret: string) => (jwtToken: string) => {
	try {
		const payload = jwt.verify(jwtToken, secret);
		if (typeof payload === 'string') {
			return undefined;
		}
		if (!('data' in payload)) {
			return undefined;
		}
		return payload.data;
	} catch (e) {
		return undefined;
	}
};

const adapter: Adapter = {
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
		const secret = env('CLIENT_SECRET');
		if (value[0] === '"') {
			return verifyData(secret)(value.slice(1, -1));
		}
		return verifyData(secret)(value);
	},
	setItem: ({
		req,
		res,
		key,
		value,
	}: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
		value: string | object;
	}) => {
		const signedData = withCookie(
			cookieHeaders(res),
			key,
			jwt.sign({ data: value }, env('CLIENT_SECRET')),
		);
		res.setHeader('Set-Cookie', signedData);
	},
	hasItem: ({
		req,
		res,
		key,
	}: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
	}) => {
		return adapter.getItem({ req, res, key }) !== undefined;
	},
	removeItem: ({
		req,
		res,
		key,
	}: {
		req: IncomingMessage;
		res: ServerResponse;
		key: string;
	}) => {
		res.setHeader('Set-Cookie', withExpiredCookie(cookieHeaders(res), key));
	},
};

export const getAuthHandlerParams = (
	authConfig: AppConfigInput['auth'],
): AuthHandlerParams => ({
	clientId: env('CLIENT_ID'),
	clientSecret: env('CLIENT_SECRET'),
	baseUrl: env('BASE_URL'),
	successCallback: authConfig.successCallback,
	errorCallback: authConfig.errorCallback,
	endpointPrefix: authConfig.endpointPrefix,
	adapter,
});
