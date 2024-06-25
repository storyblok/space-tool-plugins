import { GetCookie } from '../../../utils';
import { AuthHandlerParams } from '../../AuthHandlerParams';
import { validateAppBaseUrl } from '../../validation/validateAppBaseUrl';
import { validateEndpointPrefix } from '../../validation/validateEndpointPrefix';
import { signinEndpoint } from '../signinEndpoint';
import { handleSignInRequest } from '../handleSignIn';
import { callbackEndpoint } from '../callbackEndpoint';
import { handleCallbackRequest } from '../handleCallback';
import { handleUnknownRequest } from '../handleUnknown';
import { getLastSlug } from './getLastSlug';
import { HandleAuthRequest } from '../HandleAuthRequest';

export const handleAnyRequest: HandleAuthRequest<{
	params: AuthHandlerParams;
	url: string;
	getCookie: GetCookie;
}> = async ({ params, url, getCookie }) => {
	if (!validateAppBaseUrl(params.baseUrl)) {
		return {
			type: 'configuration-error',
			message: `Invalid baseUrl: must be an absolute URL with the https protocol and not contain any query parameters. Received ${params.baseUrl}. Example value: "https://my-app.com"`,
		};
	}
	if (!validateEndpointPrefix(params.endpointPrefix)) {
		return {
			type: 'configuration-error',
			message: `Invalid endpointPrefix: must either be undefined or be a partial slug (containing only characters, numbers, slashes, dashes, and underscored). Received: "${params.endpointPrefix}". Example value: api/authenticate`,
		};
	}

	const lastSlug = getLastSlug(url);

	switch (lastSlug) {
		case signinEndpoint:
			return handleSignInRequest({ params });
		case callbackEndpoint:
			return handleCallbackRequest({ url, getCookie, params });
		default:
			return handleUnknownRequest({ params });
	}
};
