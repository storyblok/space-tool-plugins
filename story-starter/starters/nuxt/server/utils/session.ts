import {
	isAppSessionQuery,
	sessionCookieStore,
} from '@storyblok/app-extension-auth';

type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0];

export const getAppSession = async (event: H3Event) => {
	const query = getQuery(event);

	if (!isAppSessionQuery(query)) {
		return;
	}

	const sessionStore = sessionCookieStore(authHandlerParams)({
		req: event.node.req,
		res: event.node.res,
	});

	return await sessionStore.get(query);
};
