import { hasKey } from '../../../utils';

export type TokenSet = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
};
export const isTokenSet = (tokenSet: unknown): tokenSet is TokenSet =>
	hasKey(tokenSet, 'access_token') &&
	typeof tokenSet.access_token === 'string' &&
	hasKey(tokenSet, 'expires_in') &&
	typeof tokenSet.expires_in === 'number' &&
	hasKey(tokenSet, 'refresh_token') &&
	typeof tokenSet.refresh_token === 'string';
