import http from 'http';
import { type AuthHandlerParams } from './AuthHandlerParams';
import { getCookie } from '../utils';
import { handleAnyRequest } from './handle-requests';
import { reconcileNodeResponse } from './reconcileNodeResponse';
import { supabaseAdapter } from '~/app-extension-auth/storyblok-auth-api/createSupabaseClient';

/**
 * Auth handler for Node.js
 * @param params
 */
export const authHandler = (
	params: AuthHandlerParams,
): http.RequestListener => {
	return async (req, res) => {
		const { url } = req;
		if (typeof url !== 'string') {
			res.writeHead(400).end();
			return;
		}

		//TODO: if no adapter save to cookies and console log warning about deprecation!
		const responseElement = await handleAnyRequest({
			params,
			url,
			getCookie: (name) => getCookie(req, name),
			adapter: supabaseAdapter,
		});
		reconcileNodeResponse(res, responseElement);
	};
};
