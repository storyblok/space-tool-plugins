export default defineNuxtPlugin(() => {
	const appConfig = useAppConfig();
	if (appConfig.appBridge.enabled) {
		globalThis.$fetch = $fetch.create({
			onRequest({ request, options }) {
				if (typeof request === 'string' && !request.startsWith('/')) {
					// skip external request
					return;
				}
				const headers = options.headers;
				const token = sessionStorage.getItem(KEY_TOKEN) || '';
				if (Array.isArray(headers)) {
					headers.push([APP_BRIDGE_TOKEN_HEADER_KEY, token]);
				} else if (headers instanceof Headers) {
					headers.set(APP_BRIDGE_TOKEN_HEADER_KEY, token);
				} else if (typeof headers === 'object') {
					headers[APP_BRIDGE_TOKEN_HEADER_KEY] = token;
				} else {
					options.headers = { [APP_BRIDGE_TOKEN_HEADER_KEY]: token };
				}
			},
		});
	}
});
