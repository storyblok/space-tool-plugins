import { hasKey } from '../utils';
import { AuthHandlerParams } from './AuthHandlerParams';
import { openidClient } from './handle-requests/openidClient';
import { Region } from '@storyblok/region-helper';

export type RefreshTokenWithFetchParams = Pick<
	AuthHandlerParams,
	'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
>;

export type RefreshToken = (
	refreshToken: string,
) => Promise<RefreshTokenResponse | Error>;

export type RefreshTokenResponse = { access_token: string; expires_in: number };

const isRefreshTokenResponse = (data: unknown): data is RefreshTokenResponse =>
	hasKey(data, 'access_token') &&
	typeof data.access_token === 'string' &&
	hasKey(data, 'expires_in') &&
	typeof data.expires_in === 'number';

/**
 * Uses a refresh token to request a new accessToken
 * @param params
 * @param region
 */
export const refreshToken =
	(params: RefreshTokenWithFetchParams, region: Region): RefreshToken =>
	async (refreshToken: string) => {
		try {
			const tokenSet = await openidClient(params, region).refresh(refreshToken);
			if (!isRefreshTokenResponse(tokenSet)) {
				return new Error(
					'Unexpected format: the server returned an object with an unexpected format',
				);
			}
			return tokenSet;
		} catch (e) {
			return new Error('Refresh token failed unexpectedly with an exception');
		}
	};
