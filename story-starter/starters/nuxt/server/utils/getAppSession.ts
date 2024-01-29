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
	const query = getQuery(event);

	const candidates = [
		// When a page is already authenticated on the server side,
		// and it's rendering a page that includes `useFetch()`,
		// Nuxt directly runs the serverless function on the server side
		// (without an actual HTTP request).
		//
		// In that case `event.context.appSession` exists.
		[appSession?.spaceId, appSession?.userId],

		// if this is a page request (/?spaceId=xxx&userId=yyy)
		[query.spaceId, query.userId],
		[query.space_id, query.user_id],
	];

	const referer = getHeader(event, 'referer');
	if (referer) {
		const refParams = new URL(referer).searchParams;
		candidates.push([
			refParams.get('spaceId') as string,
			refParams.get('userId') as string,
		]);
		candidates.push([
			refParams.get('space_id') as string,
			refParams.get('user_id') as string,
		]);
	}

	for (const candidate of candidates) {
		if (candidate[0] && candidate[1]) {
			return {
				spaceId: toNumber(candidate[0]),
				userId: toNumber(candidate[1]),
			};
		}
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

const toNumber = (value: any) => {
	if (typeof value === 'string') {
		return parseInt(value, 10);
	} else if (typeof value === 'number') {
		return value;
	} else {
		throw new Error(
			`Expected to be string or number. Actual value: ${JSON.stringify(value)}`
		);
	}
};
