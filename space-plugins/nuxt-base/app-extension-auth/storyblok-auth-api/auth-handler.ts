import http from 'http';
import {
	type Adapter,
	type AuthHandlerParams,
	type InternalAdapter,
} from './AuthHandlerParams';
import { getCookie } from '../utils';
import { handleAnyRequest } from './handle-requests';
import { reconcileNodeResponse } from './reconcileNodeResponse';
import { supabaseAdapter } from '~/app-extension-auth/storyblok-auth-api/createSupabaseClient';

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

		const adapter: InternalAdapter = {
			async getItem(key) {
				return await params.adapter.getItem({
					req,
					res,
					key,
				});
			},
			async setItem({ key, value }) {
				return await params.adapter.setItem({
					req,
					res,
					key,
					value,
				});
			},
			async hasItem(key) {
				return await params.adapter.hasItem({
					req,
					res,
					key,
				});
			},
			async removeItem(key) {
				return await params.adapter.removeItem({
					req,
					res,
					key,
				});
			},
		};
		/*
		things we need:
		adapter = {
			- getCallbackData
			- setCallbackData
			- removeCallbackData

			- setSession
			- getSession
			- removeSession
		}
		*/

		//TODO: if no adapter save to cookies and console log warning about deprecation!
		// TODO: clean up this later
		const { adapter: _adapter, ...rest } = params;
		const responseElement = await handleAnyRequest({
			params: rest,
			url,
			adapter,
		});
		await reconcileNodeResponse({ res, responseElement, adapter });
	};
};
