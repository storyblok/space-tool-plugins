// Is this app using App Bridge?
const KEY_ENABLED = 'sb_app_bridge_enabled';
// App Bridge token
const KEY_TOKEN = 'sb_app_bridge_token';

const useAppBridgeEnabled = () => {
	const enabled = ref(false);

	onMounted(() => {
		if (
			new URLSearchParams(location.search).get('use_app_bridge') === 'true' ||
			window.sessionStorage.getItem(KEY_ENABLED) === 'true'
		) {
			enabled.value = true;
		}
	});

	return enabled;
};

const useAppBridgeMessages = () => {
	const status = ref<
		'idle' | 'authenticating' | 'authenticated' | 'not-in-iframe'
	>('idle');

	const eventListener = async (event: MessageEvent) => {
		if (event.data.action === 'validated') {
			status.value = 'authenticated';
			const token = event.data.token;
			await $fetch('/api/_app_bridge', {
				method: 'POST',
				body: JSON.stringify({ token }),
			});
		}
	};

	onUnmounted(() => {
		// @ts-ignore not sure how to solve this
		document.removeEventListener('message', eventListener);
	});

	onMounted(async () => {
		window.addEventListener('message', eventListener);
	});

	const init = () => {
		const isInIframe = window.top !== window.self;
		if (!isInIframe) {
			status.value = 'not-in-iframe';
			return;
		}

		if (sessionStorage.getItem(KEY_TOKEN)) {
			status.value = 'authenticated';
			return;
		}

		status.value = 'authenticating';
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
