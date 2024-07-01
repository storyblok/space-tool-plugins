import type { AuthHandlerParams } from '../../storyblok-auth-api';
import type { AppSession, AppSessionQuery } from '../types';
import { getAllSessions } from './getAllSessions';
import { keysEquals, keysFromQuery } from './utils';
import type { GetCookie } from '../../utils';

export type GetSessionParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'clientId'
>;

export type GetSession = (
	params: GetSessionParams,
	getCookie: GetCookie,
	query: AppSessionQuery,
) => Promise<AppSession | undefined>;

export const getSession: GetSession = async (params, getCookie, query) => {
	const keys = {
		...keysFromQuery(query),
		appClientId: params.clientId,
	};
	const areSessionsEqual = keysEquals(keys);
	return (await getAllSessions(params, getCookie)).find(areSessionsEqual);
};
