import {
	isAppSessionQuery,
	sessionCookieStore,
} from '@storyblok/app-extension-auth';

import type { H3Event } from 'h3';

type AppSessionQuery = {
	spaceId: number;
	userId: number;
};

const getAppSessionQuery = (event: H3Event): AppSessionQuery | undefined => {
	const appSession = event.context.appSession;
	if (appSession && appSession.spaceId && appSession.userId) {
		// When a page is already authenticated on the server side,
		// and it's rendering a page that includes `useFetch()`,
		// Nuxt directly runs the serverless functionon the server side
		// (without an actual HTTP request).
		//
		// In that case `event.context.appSession` exists.
		return {
			spaceId: appSession.spaceId,
			userId: appSession.userId,
		};
	}

	const { space_id, user_id } = getQuery(event);
	if (space_id && user_id) {
		// if this is a page request (/?space_id=xxx&user_id=yyy)
		return {
			spaceId: Number(space_id),
			userId: Number(user_id),
		};
	}

	const referer = getHeader(event, 'referer');
	if (!referer) {
		return;
	}
	// if this is an API request that is coming from a page (/?space_id=xxx&user_id=yyy)
	const refererSearchParams = new URL(referer).searchParams;
	const spaceId = refererSearchParams.get('space_id');
	const userId = refererSearchParams.get('user_id');
	if (spaceId && userId) {
		return {
			spaceId: Number(spaceId),
			userId: Number(userId),
		};
	}
};

export const getAppSession = async (event: H3Event) => {
	const appSessionQuery = getAppSessionQuery(event);
	if (!isAppSessionQuery(appSessionQuery)) {
		return;
	}

	const sessionStore = sessionCookieStore(authHandlerParams)({
		req: event.node.req,
		res: event.node.res,
	});

	return await sessionStore.get(appSessionQuery);
};
