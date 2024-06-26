import { type GetCookie } from '../../utils';
import type { CookieElement } from '../ResponseElement';

/**
 * The payload of the cookie that preserves the state between the calls to `/signin` and `/callback`
 */
export type CallbackCookieData = {
	// The address that the app should redirect to after a successful authentication
	returnTo: string;
	// OAuth 2.0 code_verifier
	codeVerifier: string;
	// OAuth 2.0 state
	state: string;
};

/**
 * A cookie with this name is set before signing in, and consumed by the callback function
 */
export const callbackCookieName = 'auth.sb.callback';

export const callbackCookieElement = (data: CallbackCookieData) => ({
	name: callbackCookieName,
	value: data,
});

export const clearCallbackCookieElement: CookieElement = {
	name: callbackCookieName,
	value: undefined,
};
