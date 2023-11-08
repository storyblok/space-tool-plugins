import {
	isAppSessionQuery,
	sessionCookieStore,
} from '@storyblok/app-extension-auth';

import type { H3Event } from 'h3';

type AppSessionQuery = {
	spaceId: number;
	userId: number;
};

export const getAppSession = async (event: H3Event) => {
	// If user is already authenticated, there is a chance that
	// spaceId and userId exist in the `event.context.appSession`.
	// In this case, we can just read it instead of
	// reading ?userId=&spaceId= from the query parameters.
	const appSessionQuery: AppSessionQuery = event.context.appSession
		? {
				spaceId: event.context.appSession.spaceId,
				userId: event.context.appSession.userId,
		  }
		: getQuery(event);

	if (!isAppSessionQuery(appSessionQuery)) {
		return;
	}

	const sessionStore = sessionCookieStore(authHandlerParams)({
		req: event.node.req,
		res: event.node.res,
	});

	return await sessionStore.get(appSessionQuery);
};
