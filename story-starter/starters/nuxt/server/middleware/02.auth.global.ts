import { OAUTH_FLOW_URL, ENDPOINT_PREFIX } from '~/shared/auth';

export default defineEventHandler(async (event) => {
	// do not enforce authentication for oauth-related APIs
	if (event.path.startsWith(ENDPOINT_PREFIX)) {
		return;
	}

	const appSession = await getAppSession(event);

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
