export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();

	// do not enforce authentication for oauth-related APIs
	if (event.path.startsWith(appConfig.auth.endpointPrefix)) {
		return;
	}
	if (
		event.path === '/401' ||
		event.path.startsWith('/__nuxt_error') ||
		isMiddlewareIgnored(event.path, appConfig.auth.middleware?.ignoredPaths)
	) {
		return;
	}

	if (getQuery(event)['init_oauth'] === 'true') {
		setCookie(event, 'sb.auth', '', {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		});
		return await sendRedirect(event, appConfig.auth.initOauthFlowUrl, 302);
	}

	const appSession = await getAppSession(event);

	if (!appSession) {
		throw createError({ statusCode: 401 });
	}

	event.context.appSession = appSession;

	const afterAuthenticated = appConfig.auth.middleware?.afterAuthenticated;
	if (typeof afterAuthenticated === 'function') {
		return await afterAuthenticated({ event, appSession });
	}
});

const isMiddlewareIgnored = (
	currentPath: string,
	ignoredPaths: string[] | undefined,
): boolean =>
	Array.isArray(ignoredPaths) &&
	ignoredPaths.some((p) => currentPath.startsWith(p));
