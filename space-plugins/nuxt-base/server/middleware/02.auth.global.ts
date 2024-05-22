import { refreshToken } from '@storyblok/app-extension-auth';

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

	const appSession = await getAppSession(event);
	if (appSession) {
		console.log(
			'💡 session already exists',
			JSON.stringify(appSession, null, 2),
		);
		const { clientId, clientSecret, baseUrl, endpointPrefix } =
			getAuthHandlerParams(useAppConfig().auth);

		try {
			const refreshResult = await refreshToken(
				{
					clientId,
					clientSecret,
					baseUrl,
					endpointPrefix,
				},
				appSession.region,
			);
			console.log('💡 refresh result', JSON.stringify(refreshResult, null, 2));
		} catch (err) {
			console.log('💡 refresh failure', JSON.stringify(err, null, 2));
		}
	}

	if (!appSession) {
		if (event.path.startsWith('/api/')) {
			// APIs
			throw createError({ statusCode: 401 });
		} else {
			// pages
			console.log('💡 redirecting to', appConfig.auth.initOauthFlowUrl);
			return await sendRedirect(event, appConfig.auth.initOauthFlowUrl, 302);
		}
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
