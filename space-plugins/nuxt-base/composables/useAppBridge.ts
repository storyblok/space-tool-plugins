import type { DecodedToken } from '~/types/appBridge';

const KEY_PREFIX = 'sb_ab';
const KEY_VALIDATED_PAYLOAD = `${KEY_PREFIX}_validated_payload`;
const KEY_PARENT_HOST = `${KEY_PREFIX}_parent_host`;

const useAppBridgeMessages = () => {
	const status = ref<'initial' | 'authenticating' | 'authenticated' | 'error'>(
		'initial',
	);
	const error = ref<unknown>();
	const appConfig = useAppConfig();

	const startOAuth = async () => {
		const initOAuth = new URLSearchParams(location.search).get('init_oauth');
		const response = await $fetch('/api/_oauth', {
			method: 'POST',
			body: { initOAuth },
		});
		if (!response.ok) {
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
		return false;
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

	const init = () => {
		const isInIframe = window.top !== window.self;
		if (!isInIframe) {
			status.value = 'error';
			error.value = 'not-in-iframe';
			return;
		}

		if (isAuthenticated()) {
			status.value = 'authenticated';
			error.value = undefined;
			return;
		}

		status.value = 'authenticating';
		error.value = undefined;
		const host = getParentHost();
		sessionStorage.setItem(KEY_PARENT_HOST, host);

		window.parent.postMessage(
			{
				action: 'app-changed',
				event: 'validate',
			},
			host,
		);
	};

	return {
		status,
		init,
	};
};

export const useAppBridge = () => {
	const nuxtApp = useNuxtApp();
	const appConfig = useAppConfig();
	const { status, init } = useAppBridgeMessages();

	if (appConfig.appBridge.enabled && nuxtApp.payload.serverRendered) {
		throw new Error(
			'To use App Bridge, you must configure `ssr: false` in your `nuxt.config.ts` file.',
		);
	}

	if (appConfig.appBridge.enabled) {
		init();
	}

	return { status };
};
