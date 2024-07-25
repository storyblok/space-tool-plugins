const getPostMessageAction = (type: PluginType): PostMessageAction => {
	switch (type) {
		case 'space-plugin':
			return 'app-changed';
		case 'tool-plugin':
			return 'tool-changed';
		default:
			throw new Error(`Invalid plugin type: ${type}`);
	}
};

const getParentHost = () => {
	const storedHost = sessionStorage.getItem(KEY_PARENT_HOST);
	if (storedHost) {
		return storedHost;
	}
	const params = new URLSearchParams(location.search);
	const protocol = params.get('protocol');
	const host = params.get('host');
	if (!protocol || !host) {
		throw new Error('Missing `protocol` or `host` in query params');
	}
	return `${protocol}//${host}`;
};

const getSlug = () => {
	const storedSlug = sessionStorage.getItem(KEY_SLUG);
	if (storedSlug) {
		return storedSlug;
	}
	const params = new URLSearchParams(location.search);
	return params.get('slug');
};

const postMessageToParent = (payload: unknown) => {
	window.parent.postMessage(payload, getParentHost());
};

const useAppBridgeAuth = ({
	authenticated,
}: {
	authenticated: () => Promise<void>;
}) => {
	const appConfig = useAppConfig();
	const status = ref<'init' | 'authenticating' | 'authenticated' | 'error'>(
		'init',
	);
	const error = ref<unknown>();
	const origin = appConfig.appBridge.origin || 'https://app.storyblok.com';

	const init = async () => {
		const isInIframe = window.top !== window.self;

		if (!isInIframe) {
			status.value = 'error';
			error.value = 'not-in-iframe';
			return;
		}

		if (!isAuthenticated()) {
			sendValidateMessageToParent();
			return;
		}

		status.value = 'authenticated';
		error.value = undefined;

		await authenticated();
	};

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

	const sendValidateMessageToParent = () => {
		status.value = 'authenticating';
		error.value = undefined;
		const host = getParentHost();
		const slug = getSlug();

		try {
			const type = appConfig.type;
			const payload = createValidateMessagePayload({ type, slug });

			postMessageToParent(payload);
			sessionStorage.setItem(KEY_PARENT_HOST, host);
			sessionStorage.setItem(KEY_SLUG, slug || '');
		} catch (err) {
			sessionStorage.removeItem(KEY_PARENT_HOST);
		}
	};

	const createValidateMessagePayload: CreateValidateMessagePayload = ({
		type,
		slug,
	}) => {
		const payload: ValidateMessagePayload = {
			action: getPostMessageAction(type),
			event: 'validate',
		};

		if (type === 'tool-plugin') {
			payload.tool = slug;
		}

		return payload;
	};

	const eventListener = async (event: MessageEvent) => {
		if (event.origin !== origin) {
			// This can happen for many different reasons,
			// like a React DevTools extension, etc.
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
					sessionStorage.setItem(KEY_TOKEN, token);
					sessionStorage.setItem(
						KEY_VALIDATED_PAYLOAD,
						JSON.stringify(response.result),
					);
					status.value = 'authenticated';
					error.value = undefined;
					await authenticated();
				} else {
					sessionStorage.removeItem(KEY_TOKEN);
					sessionStorage.removeItem(KEY_VALIDATED_PAYLOAD);
					status.value = 'error';
					error.value = response.error;
				}
			} catch (err) {
				sessionStorage.removeItem(KEY_TOKEN);
				sessionStorage.removeItem(KEY_VALIDATED_PAYLOAD);
				status.value = 'error';
				error.value = err;
			}
		}
	};

	// Adds event listener to listen to events coming from Storyblok to Iframe (plugin)
	onMounted(async () => {
		window.addEventListener('message', eventListener);
	});

	onUnmounted(() => {
		window.removeEventListener('message', eventListener);
	});

	return { status, init, error };
};

const useOAuth = () => {
	const appConfig = useAppConfig();
	const status = ref<'disabled' | 'init' | 'authenticating' | 'authenticated'>(
		appConfig.appBridge.oauth ? 'init' : 'disabled',
	);

	const init = async () => {
		status.value = 'authenticating';

		const initOAuth =
			new URLSearchParams(location.search).get('init_oauth') === 'true';

		const response = await $fetch('/api/_oauth', {
			method: 'POST',
			body: { initOAuth },
		});

		if (response.ok) {
			status.value = 'authenticated';
			return;
		}

		if (initOAuth) {
			sendBeginOAuthMessageToParent(response.redirectTo);
		} else {
			window.location.href = response.redirectTo;
		}
	};

	const sendBeginOAuthMessageToParent = (redirectTo: string) => {
		const slug = getSlug();
		const type = appConfig.type;
		const payload = createOAuthInitMessagePayload({ type, slug, redirectTo });
		postMessageToParent(payload);
	};

	const createOAuthInitMessagePayload: CreateBeginOAuthMessagePayload = ({
		type,
		slug,
		redirectTo,
	}) => {
		const payload: BeginOAuthMessagePayload = {
			action: getPostMessageAction(type),
			event: 'beginOAuth',
			redirectTo,
		};

		if (type === 'tool-plugin') {
			payload.tool = slug;
		}

		return payload;
	};

	return { init, status };
};

export const useAppBridge = () => {
	const nuxtApp = useNuxtApp();
	const appConfig = useAppConfig();

	if (appConfig.appBridge.enabled && nuxtApp.payload.serverRendered) {
		throw new Error(
			'To use App Bridge, you must configure `ssr: false` in your `nuxt.config.ts` file.',
		);
	}

	const { init: initOAuth, status: oauthStatus } = useOAuth();

	const { init: initAppBridgeAuth, status: appBridgeAuthStatus } =
		useAppBridgeAuth({
			authenticated: async () => {
				if (appConfig.appBridge.oauth) {
					await initOAuth();
				}
			},
		});

	const completed = computed(() => {
		if (appConfig.appBridge.oauth) {
			return (
				appBridgeAuthStatus.value === 'authenticated' &&
				oauthStatus.value === 'authenticated'
			);
		} else {
			return appBridgeAuthStatus.value === 'authenticated';
		}
	});

	if (appConfig.appBridge.enabled) {
		initAppBridgeAuth();
	}

	return {
		completed,
		appBridgeAuth: appBridgeAuthStatus,
		oauth: oauthStatus,
	};
};
