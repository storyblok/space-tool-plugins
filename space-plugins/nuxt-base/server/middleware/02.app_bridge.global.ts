export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();
	if (!appConfig.appBridge.enabled) {
		return;
	}
	if (!event.path.startsWith('/api/')) {
		return;
	}
	const token = getHeader(event, APP_BRIDGE_TOKEN_HEADER_KEY);
	const result = await verifyAppBridgeToken(token || '');
	if (!result.ok) {
		throw createError({ statusCode: 401 });
	}
});
