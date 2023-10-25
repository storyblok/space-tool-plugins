import {
	isAppSessionQuery,
	sessionCookieStore,
} from '@storyblok/app-extension-auth';

import type { H3Event } from 'h3';

type AppSessionQuery = {
	spaceId: number;
	userId: number;
};

export const getAppSession = async (
	event: H3Event,
	query?: AppSessionQuery
) => {
	const appSessionQuery = query ?? getQuery(event);

	if (!isAppSessionQuery(appSessionQuery)) {
		return;
	}

	const sessionStore = sessionCookieStore(authHandlerParams)({
		req: event.node.req,
		res: event.node.res,
	});

	return await sessionStore.get(appSessionQuery);
};
