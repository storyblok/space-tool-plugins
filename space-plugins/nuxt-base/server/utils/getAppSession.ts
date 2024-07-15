import {
	inferSessionQuery,
	getSessionStore,
	isAppSessionQuery,
} from '@storyblok/app-extension-auth';

import type { H3Event } from 'h3';

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
// (12) https://<USER-DOMAIN>/?space_id=xxxx&user_id=xxxx

export const getAppSession = async (event: H3Event) => {
	const appConfig = useAppConfig();
	const sessionStore = getSessionStore(getAuthHandlerParams(appConfig.auth))({
		req: event.node.req,
		res: event.node.res,
	});
	const appSession = event.context.appSession;
	if (isAppSessionQuery(appSession)) {
		return await sessionStore.get({
			spaceId: appSession.spaceId,
			userId: appSession.userId,
		});
	}

	const appSessionQuery = inferSessionQuery(event.node.req);
	if (!appSessionQuery) {
		return;
	}
	return await sessionStore.get(appSessionQuery);
};
