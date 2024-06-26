import type { AppSession } from '../types';
import type { SetCookie } from '../../utils';
import { authCookieName } from '../authCookieName';
import type { AuthHandlerParams } from '../../storyblok-auth-api';

export type SetAllSessionsParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'cookieName' | 'clientId'
>;
export type SetAllSessions = (
	params: SetAllSessionsParams,
	setCookie: SetCookie,
	sessions: AppSession[],
) => Promise<void>;

export const setAllSessions: SetAllSessions = async (
	params,
	setCookie,
	sessions,
) => {
	await setCookie(authCookieName(params), {
		sessions,
	});
};
