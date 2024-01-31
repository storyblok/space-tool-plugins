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
	const appSessionQuery = extractAppSessionQuery(event);
	if (!isAppSessionQuery(appSessionQuery)) {
		return;
	}

	const sessionStore = sessionCookieStore(authHandlerParams)({
		req: event.node.req,
		res: event.node.res,
	});

	return await sessionStore.get(appSessionQuery);
};

function extractAppSessionQuery(event: H3Event): AppSessionQuery | undefined {
	const appSession = event.context.appSession;
	const query = getQuery(event);

	// When a page is already authenticated on the server side,
	// and it's rendering a page that includes `useFetch()`,
	// Nuxt directly runs the serverless function on the server side
	// (without an actual HTTP request).
	//
	// In that case `event.context.appSession` exists.
	if (appSession?.spaceId && appSession?.userId) {
		return convertToAppSessionQuery(appSession?.spaceId, appSession?.userId);
	}

	// if this is a page request (/?spaceId=xxx&userId=yyy)
	if (query.spaceId && query.userId) {
		return convertToAppSessionQuery(query.spaceId, query.userId);
	}
	if (query.space_id && query.user_id) {
		return convertToAppSessionQuery(query.space_id, query.user_id);
	}

	const referer = getHeader(event, 'referer');
	if (referer) {
		const refererParams = new URL(referer).searchParams;
		if (refererParams.get('spaceId') && refererParams.get('userId')) {
			return convertToAppSessionQuery(
				refererParams.get('spaceId'),
				refererParams.get('userId')
			);
		}

		if (refererParams.get('space_id') && refererParams.get('user_id')) {
			return convertToAppSessionQuery(
				refererParams.get('space_id'),
				refererParams.get('user_id')
			);
		}
	}
}

function convertToAppSessionQuery(spaceId: any, userId: any): AppSessionQuery {
	return {
		spaceId: toNumber(spaceId),
		userId: toNumber(userId),
	};
}

const toNumber = (value: any) => {
	if (typeof value === 'string') {
		return parseInt(value, 10);
	}
	if (typeof value === 'number') {
		return value;
	}
	throw new Error(
		`Expected to be string or number. Actual value: ${JSON.stringify(value)}`
	);
};
