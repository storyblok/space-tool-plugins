import { AppSession } from './types';
import { shouldRefresh } from './shouldRefresh';
import { refreshAppSession } from './refreshAppSession/refreshAppSession';
import { refreshToken } from '../storyblok-auth-api';
import { putSession, removeSession } from './crud';
import { AuthHandlerParams } from '../storyblok-auth-api';
import { GetCookie, SetCookie } from '../utils';

export type RefreshParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'clientId' | 'baseUrl' | 'endpointPrefix'
>;
export type Refresh = (
	params: RefreshParams,
	getCookie: GetCookie,
	setCookie: SetCookie,
	appSession: AppSession | undefined,
) => Promise<AppSession | undefined>;

/**
 * Given a stored session and getters and setters for mutating the storage, refreshes the session
 * @param params
 * @param getCookie
 * @param setCookie
 * @param currentAppSession
 */
export const refreshStoredAppSession: Refresh = async (
	params,
	getCookie,
	setCookie,
	currentAppSession,
) => {
	if (!currentAppSession) {
		// passed undefined
		return undefined;
	}
	if (!shouldRefresh(currentAppSession)) {
		// does not need refresh
		return currentAppSession;
	}

	// should refresh
	const newAppSession = await refreshAppSession(
		refreshToken(params, currentAppSession.region),
	)(currentAppSession);

	if (!newAppSession) {
		// Refresh failed -> user becomes unauthenticated
		removeSession(params, getCookie, setCookie, currentAppSession);
		return undefined;
	}

	return putSession(params, getCookie, setCookie, newAppSession);
};
