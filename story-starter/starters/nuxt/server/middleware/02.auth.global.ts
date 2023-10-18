import {
	isAppSessionQuery,
	sessionCookieStore,
} from '@storyblok/app-extension-auth';
import { authHandlerParams } from '../utils/auth';
import { OAUTH_FLOW_URL, ENDPOINT_PREFIX } from '~/shared/auth';

export default defineEventHandler(async (event) => {
	if (event.path.startsWith(ENDPOINT_PREFIX)) {
		return;
	}

	const query = getQuery(event);

	if (!isAppSessionQuery(query)) {
		return await sendRedirect(event, OAUTH_FLOW_URL, 302);
	}

	const sessionStore = sessionCookieStore(authHandlerParams)({
		req: event.node.req,
		res: event.node.res,
	});

	const appSession = await sessionStore.get(query);
	if (!appSession) {
		return await sendRedirect(event, OAUTH_FLOW_URL, 302);
	}

	// const { accessToken, region, spaceId } = appSession;
});
