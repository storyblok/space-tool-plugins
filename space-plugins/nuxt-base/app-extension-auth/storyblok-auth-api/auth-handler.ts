import http from 'http';
import { type Adapter, type AuthHandlerParams } from './AuthHandlerParams';
import { handleAnyRequest } from './handle-requests';
import { reconcileNodeResponse } from './reconcileNodeResponse';
import { createInternalAdapter } from './internalAdapter';
import { cookieAdapter } from '~/app-extension-auth/adapters/cookieAdapter';

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

		if (!params.adapter) {
			console.warn('Sessions will be stored in cookies');
		}

		const adapter = params.adapter ?? cookieAdapter;

		const internalAdapter = createInternalAdapter({
			req,
			res,
			adapter,
		});

		const responseElement = await handleAnyRequest({
			params,
			url,
			adapter: internalAdapter,
		});

		await reconcileNodeResponse({
			res,
			responseElement,
			adapter: internalAdapter,
		});
	};
};
