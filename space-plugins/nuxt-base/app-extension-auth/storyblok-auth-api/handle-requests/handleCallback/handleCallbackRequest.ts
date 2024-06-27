import { type AppSession } from '../../../session';
import { appendQueryParams } from '../../../utils/query-params/append-query-params';
import { defaultSessionIdentifier } from '../../../session/createAuthSessionIdentifier';
import {
	clearCallbackData,
	type CallbackData,
	callbackDataIdentifier,
} from '../callbackData';
import type { SessionElement } from '../../ResponseElement';
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

		const getSession = async (name: string) => await adapter.getItem(name);

		//TODO: fix typing
		const callbackData = (await adapter.getItem(
			callbackDataIdentifier,
		)) as CallbackData;

		if (!callbackData) {
			return {
				type: 'error',
				sessions: [clearCallbackData],
				redirectTo: params.errorCallback,
			};
		}

		const { codeVerifier, state, returnTo } = callbackData;

		const appSession = await fetchAppSession(params, {
			region,
			codeVerifier,
			state,
			url,
		});

		if (!appSession) {
			return {
				type: 'error',
				sessions: [clearCallbackData],
				redirectTo: params.errorCallback,
			};
		}

		const queryParams: AppSessionQueryParams = {
			spaceId: appSession.spaceId.toString(),
			userId: appSession.userId.toString(),
		};

		const redirectTo = appendQueryParams(returnTo, queryParams);

		const setSession: SessionElement = {
			name: defaultSessionIdentifier,
			value: appSession,
		};

		return {
			type: 'success',
			redirectTo,
			sessions: [clearCallbackData, setSession],
		};
	} catch (e) {
		return {
			type: 'error',
			message: e instanceof Error ? e.message : 'An unknown error occurred',
			sessions: [clearCallbackData],
			redirectTo: params.errorCallback,
		};
	}
};
