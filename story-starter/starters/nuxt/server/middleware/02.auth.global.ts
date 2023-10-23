import { OAUTH_FLOW_URL } from '~/shared/auth';

export default defineEventHandler(async (event) => {
	// do not enforce authentication for APIs
	if (event.path.startsWith('/api/')) {
		return;
	}

	const appSession = await getAppSession(event);
	if (!appSession) {
		return await sendRedirect(event, OAUTH_FLOW_URL, 302);
	}
});
