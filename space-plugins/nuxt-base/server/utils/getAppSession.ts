import {
	isAppSessionQuery,
	sessionCookieStore,
} from '@storyblok/app-extension-auth';

import type { H3Event } from 'h3';

type AppSessionQuery = {
	spaceId: number;
	userId: number;
};

//      Overall auth flow
//  (1) https://app.storyblok.com/v1/spaces/xxxx/app_provisions/xxxx
//  (2) https://<USER-DOMAIN>/?space_id=xxxx&space_is_trial=false&space_name=xxxx&user_id=xxxx&user_name=null&user_lang=en&user_is_admin=true
//  (3) https://<USER-DOMAIN>/api/connect/storyblok
//      OAuth Consent Page ↓
//  (4) https://app.storyblok.com/oauth/authorize?client_id=xxxx&scope=read_content%20write_content&response_type=code&redirect_uri=https%3A%2F%2F<USER-DOMAIN>%2Fapi%2Fconnect%2Fcallback&code_challenge=xxxx&state=xxxx&code_challenge_method=S256
//  (5) https://<USER-DOMAIN>/api/connect/callback?code=xxxx&space_id=183395
//      The cookie `sb.auth` is not set at this time, so it redirects to ↓
//  (6) https://<USER-DOMAIN>/401
//      The middleware catches /401 and redirects to ↓
//  (7) https://app.storyblok.com/oauth/app_redirect

//  Now (2) ~ (5) repeats
//  (8) https://<USER-DOMAIN>/?space_id=xxxx&space_is_trial=false&space_name=xxxx&user_id=xxxx&user_name=null&user_lang=en&user_is_admin=true
//  (9) https://<USER-DOMAIN>/api/connect/storyblok
// (10) https://<USER-DOMAIN>/oauth/authorize?client_id=xxxx&scope=read_content%20write_content&response_type=code&redirect_uri=https%3A%2F%2F<USER-DOMAIN>%2Fapi%2Fconnect%2Fcallback&code_challenge=xxxx&state=xxxx&code_challenge_method=S256
// (11) https://<USER-DOMAIN>/api/connect/callback?code=xxxx&state=xxxx&space_id=xxxx

// Finished. Authenticated successfully.
// (12) https://<USER-DOMAIN>/?spaceId=xxxx&userId=xxxx

// If a user visits this plugin with the `sb.auth` token already set, they will be redirected to ↓
// (13) https://<USER-DOMAIN>/?space_id=xxxx&user_id=xxxx
// instead of spaceId and userId.
// It should be more consistent, but at least the `nuxt-base` layer takes care of it now.

export const getAppSession = async (event: H3Event) => {
	const appSessionQuery = extractAppSessionQuery(event);
	if (!isAppSessionQuery(appSessionQuery)) {
		return;
	}

	const appConfig = useAppConfig();
	const sessionStore = sessionCookieStore(getAuthHandlerParams(appConfig.auth))(
		{
			req: event.node.req,
			res: event.node.res,
		},
	);

	return await sessionStore.get(appSessionQuery);
};

function extractAppSessionQuery(event: H3Event): AppSessionQuery | undefined {
	const appSession = event.context.appSession;
	const query = getQuery(event);

	console.log('query', query);
	console.log('appSession --> getAppSession.ts', appSession);

	if (appSession?.spaceId && appSession?.userId) {
		// When a page is already authenticated on the server side,
		// and it's rendering a page that includes `useFetch('...', { server: true })`,
		// Nuxt directly runs the serverless function on the server side
		// (without an actual HTTP request).
		//
		// In that case `event.context.appSession` exists.
		return convertToAppSessionQuery(appSession?.spaceId, appSession?.userId);
	}

	// (12) if this is a page request (/?spaceId=xxx&userId=yyy)
	if (query.spaceId && query.userId) {
		return convertToAppSessionQuery(query.spaceId, query.userId);
	}

	// (13) if this is a page request (/?space_id=xxx&user_id=yyy)
	if (query.space_id && query.user_id) {
		return convertToAppSessionQuery(query.space_id, query.user_id);
	}

	const referer = getHeader(event, 'referer');
	// if this is an API request (/api/xxx), the `referer` header exists.
	if (referer) {
		// `referer` can be one of the following:
		// https://<USER-DOMAIN>/?spaceId=xxxx&userId=xxxx
		// or
		// https://<USER-DOMAIN>/?space_id=xxxx&user_id=xxxx
		const refererParams = new URL(referer).searchParams;
		if (refererParams.get('spaceId') && refererParams.get('userId')) {
			return convertToAppSessionQuery(
				refererParams.get('spaceId'),
				refererParams.get('userId'),
			);
		}

		if (refererParams.get('space_id') && refererParams.get('user_id')) {
			return convertToAppSessionQuery(
				refererParams.get('space_id'),
				refererParams.get('user_id'),
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
		`Expected to be string or number. Actual value: ${JSON.stringify(value)}`,
	);
};
