import { AppSession } from '../types';
import { RefreshToken } from '../../storyblok-auth-api';

/**
 * Returns a new session that is refreshed
 * @return a session that is refreshed
 * @param refreshToken a function that retrieves a new access_token based on a refresh_token
 */
export const refreshAppSession =
	(refreshToken: RefreshToken) =>
	async (oldSession: AppSession): Promise<AppSession | undefined> => {
		const refreshedToken = await refreshToken(oldSession.refreshToken);
		if (refreshedToken instanceof Error) {
			console.error('Failed to refresh token:', refreshedToken);
			return undefined;
		}
		return {
			...oldSession,
			accessToken: refreshedToken.access_token,
			expiresAt: Date.now() + refreshedToken.expires_in * 1000,
		};
	};
