export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();

	// do not enforce authentication for oauth-related APIs
	if (event.path.startsWith(appConfig.auth.endpointPrefix)) {
		return;
	}
	if (
		event.path === '/401' ||
		event.path.startsWith('/__nuxt_error') ||
		isMiddlewareDisabled(event.path, appConfig.auth.middleware?.ignoredPaths)
	) {
		return;
	}

	const appSession = await getAppSession(event);

	if (!appSession) {
		if (event.path.startsWith('/api/')) {
			// APIs
			throw createError({ statusCode: 401 });
		} else {
			// pages
			return await sendRedirect(event, appConfig.auth.initOauthFlowUrl, 302);
		}
	}

	event.context.appSession = appSession;
});

const isMiddlewareDisabled = (
	path: string,
	disabledPaths: string[] | undefined,
): boolean =>
	Array.isArray(disabledPaths) && disabledPaths.some((p) => path.startsWith(p));
