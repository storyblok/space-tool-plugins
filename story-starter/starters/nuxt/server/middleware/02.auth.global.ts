import { OAUTH_FLOW_URL, ENDPOINT_PREFIX } from '~/shared/auth';

export default defineEventHandler(async (event) => {
	// do not enforce authentication for oauth-related APIs
	if (event.path.startsWith(ENDPOINT_PREFIX)) {
		return;
	}

	// If user is already authenticated, there is a chance that
	// spaceId and userId exist in the `event.context`.
	// In this case, we don't need to read ?userId=&spaceId=
	// to query the app session. We can just use the ones from `event.context`.
	const appSessionQuery = event.context.appSession
		? {
				spaceId: event.context.appSession.spaceId,
				userId: event.context.appSession.userId,
		  }
		: undefined;
	const appSession = await getAppSession(event, appSessionQuery);

	if (!appSession) {
		if (event.path.startsWith('/api/')) {
			// APIs
			throw createError({ statusCode: 401 });
		} else {
			// pages
			return await sendRedirect(event, OAUTH_FLOW_URL, 302);
		}
	}

	event.context.appSession = appSession;
});
