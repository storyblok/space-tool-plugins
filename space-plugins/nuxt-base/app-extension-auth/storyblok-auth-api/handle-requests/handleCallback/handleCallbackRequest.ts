import { type AppSession, getAllSessions } from '../../../session';
import { type GetCookie, signData  } from '../../../utils';
import { appendQueryParams } from '../../../utils/query-params/append-query-params';
import { authCookieName } from '../../../session/authCookieName';
import {
	clearCallbackCookieElement,
	getCallbackCookieData,
} from '../callbackCookie';
import { type CookieElement } from '../../ResponseElement';
import type {
	AuthHandlerParams,
	InternalAdapter,
} from '../../AuthHandlerParams';
import { regionFromUrl } from './spaceIdFromUrl';
import { type HandleAuthRequest } from '../HandleAuthRequest';
import { fetchAppSession } from './fetchAppSession';

export type AppSessionQueryParams = Record<
	keyof Pick<AppSession, 'spaceId' | 'userId'>,
	string
>;

export const handleCallbackRequest: HandleAuthRequest<{
	params: AuthHandlerParams;
	adapter: InternalAdapter;
	url: string;
}> = async ({ params, url, adapter }) => {
	try {
		const region = regionFromUrl(url);
		if (!region) {
			return {
				type: 'error',
				message: `The space_id in the callback URL cannot be mapped to a region. URL: ${url}`,
			};
		}

		const getCookie = async (name: string) => await adapter.getItem(name);

		const callbackCookie = await getCallbackCookieData(
			params.clientSecret,
			getCookie,
		);
		if (!callbackCookie) {
			return {
				type: 'error',
				setCookies: [clearCallbackCookieElement],
				redirectTo: params.errorCallback,
			};
		}

		const { codeVerifier, state, returnTo } = callbackCookie;
		const appSession = await fetchAppSession(params, {
			region,
			codeVerifier,
			state,
			url,
		});
		if (!appSession) {
			return {
				type: 'error',
				setCookies: [clearCallbackCookieElement],
				redirectTo: params.errorCallback,
			};
		}

		const queryParams: AppSessionQueryParams = {
			spaceId: appSession.spaceId.toString(),
			userId: appSession.userId.toString(),
		};
		const redirectTo = appendQueryParams(returnTo, queryParams);

		const setSessions: CookieElement = {
			name: authCookieName(params),
			value: signData(params.clientSecret)({
				sessions: [...(await getAllSessions(params, getCookie)), appSession],
			}),
		};

		return {
			type: 'success',
			redirectTo,
			setCookies: [clearCallbackCookieElement, setSessions],
		};
	} catch (e) {
		return {
			type: 'error',
			message: e instanceof Error ? e.message : 'An unknown error occurred',
			setCookies: [clearCallbackCookieElement],
			redirectTo: params.errorCallback,
		};
	}
};
