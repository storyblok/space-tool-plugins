import { type AuthHandlerParams } from '../../storyblok-auth-api';
import { type AppSession } from '../types';
import { type GetCookie } from '../../utils';
import { authCookieName } from '../authCookieName';
import { isAppSessionCookiePayload } from './AppSessionCookiePayload';

export type GetAllSessionsParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'cookieName' | 'clientId'
>;

export type GetAllSessions = (
	params: GetAllSessionsParams,
	getCookie: GetCookie,
) => Promise<AppSession[]>;

export const getAllSessions: GetAllSessions = async (params, getCookie) => {
	const cookie = await getCookie(authCookieName(params));
	if (!isAppSessionCookiePayload(cookie)) {
		return [];
	}
	return cookie.sessions;
};
