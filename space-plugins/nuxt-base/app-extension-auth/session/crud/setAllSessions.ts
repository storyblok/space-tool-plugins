import type { AppSession } from '../types';
import type { SetCookie } from '../../utils';
import { defaultSessionIdentifier } from '../createAuthSessionIdentifier';
import type { AuthHandlerParams } from '../../storyblok-auth-api';

export type SetAllSessionsParams = Pick<
	AuthHandlerParams,
	'clientSecret' | 'clientId'
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
	await setCookie(defaultSessionIdentifier, {
		sessions,
	});
};
