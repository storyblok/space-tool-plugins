import { type AuthHandlerParams } from '../../storyblok-auth-api';
import { type AppSession } from '../types';
import { type GetCookie, getSignedCookie } from '../../utils';
import { authCookieName } from '../authCookieName';
import { isAppSessionCookiePayload } from './AppSessionCookiePayload';

export type GetAllSessionsParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'cookieName' | 'clientId'
>;

export type GetAllSessions = (
	params: GetAllSessionsParams,
	getCookie: GetCookie,
) => AppSession[];

export const getAllSessions: GetAllSessions = (params, getCookie) => {
	const signedCookie = getSignedCookie(
		params.clientSecret,
		getCookie,
		authCookieName(params),
	);
	if (!isAppSessionCookiePayload(signedCookie)) {
		return [];
	}
	return signedCookie.sessions;
};
