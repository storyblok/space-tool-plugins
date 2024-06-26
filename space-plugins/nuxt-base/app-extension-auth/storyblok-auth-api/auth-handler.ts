import http from 'http';
import { type Adapter, type AuthHandlerParams } from './AuthHandlerParams';
import { handleAnyRequest } from './handle-requests';
import { reconcileNodeResponse } from './reconcileNodeResponse';
import { createInternalAdapter } from './internalAdapter';

/**
 * Auth handler for Node.js
 * @param params
 */
export const authHandler = (
	params: AuthHandlerParams & { adapter: Adapter },
): http.RequestListener => {
	return async (req, res) => {
		const { url } = req;
		if (typeof url !== 'string') {
			res.writeHead(400).end();
			return;
		}

		const adapter = createInternalAdapter({
			req,
			res,
			adapter: params.adapter,
		});

		//TODO: if no adapter save to cookies and console log warning about deprecation!
		// TODO: clean up this later
		const responseElement = await handleAnyRequest({
			params,
			url,
			adapter,
		});
		await reconcileNodeResponse({ res, responseElement, adapter });
	};
};
