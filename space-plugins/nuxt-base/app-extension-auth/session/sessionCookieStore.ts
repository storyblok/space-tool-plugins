import type { AppSessionCookieStoreFactory, AppSessionStore } from './types';
import { getAllSessions, getSession, putSession, removeSession } from './crud';
import { refreshStoredAppSession } from './refreshStoredAppSession';
import type { GetCookie, SetCookie } from '../utils';
import { createInternalAdapter } from '../storyblok-auth-api/internalAdapter';
import { cookieAdapter } from '~/app-extension-auth/adapters/cookieAdapter';

export const sessionCookieStore: AppSessionCookieStoreFactory =
	(params) =>
	(requestParams): AppSessionStore => {
		const internalAdapter = createInternalAdapter({
			req: requestParams.req,
			res: requestParams.res,
			adapter: params.adapter ?? cookieAdapter, // when no adapter was passed take the default cookie adapter,
		});

		const getCookie: GetCookie = async (name) => internalAdapter.getItem(name);

		const setCookie: SetCookie = async (name, value) =>
			internalAdapter.setItem({
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
