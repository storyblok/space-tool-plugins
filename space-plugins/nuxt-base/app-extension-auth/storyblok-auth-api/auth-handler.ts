import http from 'http';
import { type AuthHandlerParams } from './AuthHandlerParams';
import { getCookie } from '../utils';
import { handleAnyRequest } from './handle-requests';
import { reconcileNodeResponse } from './reconcileNodeResponse';

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
		const responseElement = await handleAnyRequest({
			params,
			url,
			getCookie: (name) => getCookie(req, name),
		});
		reconcileNodeResponse(res, responseElement);
	};
};
