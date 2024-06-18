import type { DecodedToken } from '~/types/appBridge';

const KEY_PREFIX = 'sb_ab';
// Is this app using App Bridge?
const KEY_ENABLED = `${KEY_PREFIX}_enabled`;
// App Bridge token payload
const KEY_VALIDATED_PAYLOAD = `${KEY_PREFIX}_validated_payload`;

const QUERY_USE_APP_BRIDGE = 'use_app_bridge';

const useAppBridgeEnabled = () => {
	const enabled = ref(false);

	onMounted(() => {
		if (
			new URLSearchParams(location.search).get(QUERY_USE_APP_BRIDGE) ===
				'true' ||
			window.sessionStorage.getItem(KEY_ENABLED) === 'true'
		) {
			enabled.value = true;
		}
	});

	return enabled;
};

const useAppBridgeMessages = () => {
	const status = ref<'initial' | 'authenticating' | 'authenticated' | 'error'>(
		'initial',
	);
	const error = ref<unknown>();
	const config = useAppConfig();

	const eventListener = async (event: MessageEvent) => {
		if (event.origin !== config.appBridge.origin) {
			console.error('postMessage from unknown origin', {
				actual: event.origin,
				expected: config.appBridge.origin,
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
		const params = new URLSearchParams(location.search);
		const protocol = params.get('protocol');
		const host = params.get('host');

		window.parent.postMessage(
			{
				action: 'app-changed',
				event: 'validate',
			},
			`${protocol}//${host}`,
		);
	};

	return {
		status,
		init,
	};
};

export const useAppBridge = () => {
	const enabled = useAppBridgeEnabled();
	const { status, init } = useAppBridgeMessages();

	watch(
		enabled,
		(value) => {
			if (value) {
				init();
			}
		},
		{ immediate: true },
	);

	return { status };
};
