import { APP_BRIDGE_TOKEN_HEADER_KEY } from '../../utils/const';

const SKIP_AUTH_FOR = ['/api/_app_bridge', '/api/_oauth'];

export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();
	if (!appConfig.appBridge.enabled) {
		return;
	}
	const pathname = event.path.split('?')[0];
	if (!pathname.startsWith('/api/')) {
		return;
	}
	if (SKIP_AUTH_FOR.includes(pathname)) {
		return;
	}
	if (
		[
			appConfig.auth.initOauthFlowUrl,
			`${appConfig.auth.endpointPrefix}/callback`,
		].includes(pathname)
	) {
		return;
	}
	const token = getHeader(event, APP_BRIDGE_TOKEN_HEADER_KEY);
	const result = await verifyAppBridgeToken(token || '');
	if (!result.ok) {
		throw createError({ statusCode: 401 });
	}
});
