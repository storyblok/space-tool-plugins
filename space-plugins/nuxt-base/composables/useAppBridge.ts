import type { DecodedToken, PluginType } from '~/types/appBridge';

type PostMessageAction = 'tool-changed' | 'app-changed';

type ValidateMessagePayload = {
	action: PostMessageAction;
	event: 'validate';
	tool?: string | null;
};

type BeginOAuthMessagePayload = {
	action: PostMessageAction;
	event: 'beginOAuth';
	tool?: string | null;
	redirectTo: string;
};

type CreateValidateMessagePayload = (params: {
	type: PluginType;
	slug: string | null;
}) => ValidateMessagePayload;

type CreateBeginOAuthMessagePayload = (params: {
	type: PluginType;
	slug: string | null;
	redirectTo: string;
}) => BeginOAuthMessagePayload;

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

const useAppBridgeMessages = () => {
	const appConfig = useAppConfig();
	const status = ref<'init' | 'authenticating' | 'authenticated' | 'error'>(
		'init',
	);

	//TODO: rename to oauthStatus?
	const oauth = ref<'disabled' | 'init' | 'authenticating' | 'authenticated'>(
		appConfig.appBridge.oauth ? 'init' : 'disabled',
	);

	const error = ref<unknown>();
	const origin = appConfig.appBridge.origin || 'https://app.storyblok.com';

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
			return;
		}

		sendBeginOAuthMessageToParent(response.redirectTo);
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

					if (appConfig.appBridge.oauth) {
						await startOAuth();
					}
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

	//TODO: rename initAppBridge?
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

		if (appConfig.appBridge.oauth) {
			await startOAuth();
			return;
		}

		return;
	};

	const sendValidateMessageToParent = () => {
		status.value = 'authenticating';
		error.value = undefined;
		const host = getParentHost();
		const slug = getSlug();

		try {
			const type = appConfig.appBridge.type;
			const payload = createValidateMessagePayload({ type, slug });

			window.parent.postMessage(payload, host);
			sessionStorage.setItem(KEY_PARENT_HOST, host);
			sessionStorage.setItem(KEY_SLUG, slug || '');
		} catch (err) {
			sessionStorage.removeItem(KEY_PARENT_HOST);
		}
	};

	const sendBeginOAuthMessageToParent = (redirectTo: string) => {
		const host = getParentHost();
		const slug = getSlug();
		const type = appConfig.appBridge.type;
		const payload = createOAuthInitMessagePayload({ type, slug, redirectTo });
		window.parent.postMessage(payload, host);
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

	// Adds even listener to listen to events coming from Storyblok to Iframe (plugin)
	onMounted(async () => {
		window.addEventListener('message', eventListener);
	});

	onUnmounted(() => {
		window.removeEventListener('message', eventListener);
	});

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
