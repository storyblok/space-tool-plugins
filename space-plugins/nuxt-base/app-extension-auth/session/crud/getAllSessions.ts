import { type AuthHandlerParams } from '../../storyblok-auth-api';
import { type AppSession } from '../types';
import { type GetCookie } from '../../utils';
import { isAppSessionCookiePayload } from './AppSessionCookiePayload';
import { defaultSessionIdentifier } from '~/app-extension-auth/session/createAuthSessionIdentifier';

export type GetAllSessionsParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'clientId'
>;

export type GetAllSessions = (
	params: GetAllSessionsParams,
	getCookie: GetCookie,
) => Promise<AppSession[]>;

export const getAllSessions: GetAllSessions = async (params, getCookie) => {
	const cookie = await getCookie(defaultSessionIdentifier);
	if (!isAppSessionCookiePayload(cookie)) {
		return [];
	}
	return cookie.sessions;
};
