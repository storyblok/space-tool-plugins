import type { AppSession, AppSessionQuery } from '../types';
import type { AuthHandlerParams } from '../../storyblok-auth-api';
import { setAllSessions } from './setAllSessions';
import { getAllSessions } from './getAllSessions';
import { keysEquals, keysFromQuery } from './utils';
import type { SetCookie, GetCookie } from '../../utils';

export type RemoveSessionParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'cookieName' | 'clientId'
>;

export type RemoveSession = (
	params: RemoveSessionParams,
	getCookie: GetCookie,
	setCookie: SetCookie,
	query: AppSessionQuery,
) => Promise<AppSession | undefined>;

export const removeSession: RemoveSession = async (
	params,
	getCookie,
	setCookie,
	query,
) => {
	// TODO: [important] this won't work for Supabase adapter
	const sessions = await getAllSessions(params, getCookie);
	const keys = {
		...keysFromQuery(query),
		appClientId: params.clientId,
	};
	const isEqual = keysEquals(keys);
	const toRemove = sessions.find(isEqual);
	const allOtherSessions = sessions.filter((s) => s !== toRemove);
	await setAllSessions(params, setCookie, allOtherSessions);
	return toRemove;
};
