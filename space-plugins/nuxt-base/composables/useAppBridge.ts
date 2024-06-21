import type { DecodedToken, PluginType } from '~/types/appBridge';

const KEY_PREFIX = 'sb_ab';
const KEY_VALIDATED_PAYLOAD = `${KEY_PREFIX}_validated_payload`;
const KEY_PARENT_HOST = `${KEY_PREFIX}_parent_host`;
const KEY_SLUG = `${KEY_PREFIX}_slug`;

const getPostMessageAction = (type: PluginType) => {
	switch (type) {
		case 'space-plugin':
			return 'app-changed';
		case 'tool-plugin':
			return 'tool-changed';
		default:
			throw new Error(`Invalid plugin type: ${type}`);
	}
};

const useAppBridgeMessages = () => {
	const status = ref<'init' | 'authenticating' | 'authenticated' | 'error'>(
		'init',
	);
	const error = ref<unknown>();
	const appConfig = useAppConfig();
	const oauth = ref<'disabled' | 'init' | 'authenticating' | 'authenticated'>(
		appConfig.appBridge.oauth ? 'init' : 'disabled',
	);

	const startOAuth = async () => {
		oauth.value = 'authenticating';
		const initOAuth =
			new URLSearchParams(location.search).get('init_oauth') === 'true';
		const response = await $fetch('/api/_oauth', {
			method: 'POST',
			body: { initOAuth },
		});
		if (response.ok) {
			oauth.value = 'authenticated';
		} else {
			location.href = response.redirectTo;
		}
	};

	const eventListener = async (event: MessageEvent) => {
		if (event.origin !== appConfig.appBridge.origin) {
			console.error('postMessage from unknown origin', {
				actual: event.origin,
				expected: appConfig.appBridge.origin,
			});
			return;
		}

		if (event.data.action === 'validated') {
			const token = event.data.token;
			try {
				const response = await $fetch('/api/_app_bridge', {
					method: 'POST',
					body: JSON.stringify({ token }),
				});
				if (response.ok) {
					sessionStorage.setItem(
						KEY_VALIDATED_PAYLOAD,
						JSON.stringify(response.result),
					);
					status.value = 'authenticated';
					error.value = undefined;

					if (appConfig.appBridge.oauth) {
						await startOAuth();
					}
				} else {
					sessionStorage.removeItem(KEY_VALIDATED_PAYLOAD);
					status.value = 'error';
					error.value = response.error;
				}
			} catch (err) {
				sessionStorage.removeItem(KEY_VALIDATED_PAYLOAD);
				status.value = 'error';
				error.value = err;
			}
		}
	};

	onUnmounted(() => {
		// @ts-ignore not sure how to solve this
		document.removeEventListener('message', eventListener);
	});

	onMounted(async () => {
		window.addEventListener('message', eventListener);
	});

	const isAuthenticated = () => {
		try {
			const payload: DecodedToken = JSON.parse(
				sessionStorage.getItem(KEY_VALIDATED_PAYLOAD) || '',
			);
			return payload && new Date().getTime() / 1000 < payload.exp;
		} catch (err) {
			return false;
		}
	};

	const getParentHost = () => {
		const storedHost = sessionStorage.getItem(KEY_PARENT_HOST);
		if (storedHost) {
			return storedHost;
		}
		const params = new URLSearchParams(location.search);
		return `${params.get('protocol')}//${params.get('host')}`;
	};

	const getSlug = () => {
		const storedSlug = sessionStorage.getItem(KEY_SLUG);
		if (storedSlug) {
			return storedSlug;
		}
		const params = new URLSearchParams(location.search);
		return params.get('slug');
	};

	const init = async () => {
		const isInIframe = window.top !== window.self;
		if (!isInIframe) {
			status.value = 'error';
			error.value = 'not-in-iframe';
			return;
		}

		if (isAuthenticated()) {
			status.value = 'authenticated';
			error.value = undefined;

			if (appConfig.appBridge.oauth) {
				return await startOAuth();
			}
			return;
		}

		status.value = 'authenticating';
		error.value = undefined;
		const host = getParentHost();
		const slug = getSlug();

		try {
			const payload: Record<string, any> = {
				action: getPostMessageAction(appConfig.appBridge.type),
				event: 'validate',
			};
			if ((appConfig.appBridge.type as PluginType) === 'tool-plugin') {
				payload.tool = slug;
			}
			window.parent.postMessage(payload, host);
			sessionStorage.setItem(KEY_PARENT_HOST, host);
			sessionStorage.setItem(KEY_SLUG, slug || '');
		} catch (err) {
			sessionStorage.removeItem(KEY_PARENT_HOST);
		}
	};

	return {
		status,
		oauth,
		init,
	};
};

export const useAppBridge = () => {
	const nuxtApp = useNuxtApp();
	const appConfig = useAppConfig();
	const { status, oauth, init } = useAppBridgeMessages();

	if (appConfig.appBridge.enabled && nuxtApp.payload.serverRendered) {
		throw new Error(
			'To use App Bridge, you must configure `ssr: false` in your `nuxt.config.ts` file.',
		);
	}

	if (appConfig.appBridge.enabled) {
		init();
	}

	return { status, oauth };
};
