import type { AppSessionCookieStoreFactory, AppSessionStore } from './types';
import { getAllSessions, getSession, putSession, removeSession } from './crud';
import { refreshStoredAppSession } from './refreshStoredAppSession';
import type { GetCookie, SetCookie } from '../utils';
import { createInternalAdapter } from '../storyblok-auth-api/internalAdapter';

export const sessionCookieStore: AppSessionCookieStoreFactory =
	(params) =>
	(requestParams): AppSessionStore => {
		const adapter = createInternalAdapter({
			req: requestParams.req,
			res: requestParams.res,
			adapter: params.adapter,
		});

		const getCookie: GetCookie = async (name) =>
			await params.adapter.getItem({
				req: requestParams.req,
				res: requestParams.res,
				key: name,
			});

		const setCookie: SetCookie = async (name, value) =>
			await params.adapter.setItem({
				req: requestParams.req,
				res: requestParams.res,
				key: name,
				value,
			});

		return {
			get: async (keys) =>
				refreshStoredAppSession(
					params,
					getCookie,
					setCookie,
					await getSession(params, getCookie, keys),
				),
			getAll: async () => await getAllSessions(params, getCookie),
			put: async (session) =>
				await putSession(params, getCookie, setCookie, session),
			remove: async (keys) =>
				await removeSession(params, getCookie, setCookie, keys),
		};
	};
