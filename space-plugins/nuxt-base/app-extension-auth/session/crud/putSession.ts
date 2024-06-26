import type { AppSession } from '../types';
import type { AuthHandlerParams } from '../../storyblok-auth-api';
import { setAllSessions } from './setAllSessions';
import { getAllSessions } from './getAllSessions';
import { keysEquals } from './utils';
import type { GetCookie, SetCookie } from '../../utils';

export type PutSessionParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'cookieName' | 'clientId'
>;

export type PutSession = (
	params: PutSessionParams,
	getCookie: GetCookie,
	setCookie: SetCookie,
	session: AppSession,
) => Promise<AppSession>;

export const putSession: PutSession = async (
	params,
	getCookie,
	setCookie,
	newSession,
) => {
	const isNotEqual = (otherSession: AppSession) =>
		!keysEquals(newSession)(otherSession);
	const otherSessions = (await getAllSessions(params, getCookie)).filter(
		isNotEqual,
	);
	await setAllSessions(params, setCookie, [...otherSessions, newSession]);
	return newSession;
};
