import {
	AppBridgeSession,
	BeginOAuthMessagePayload,
	CreateBeginOAuthMessagePayload,
	CreateValidateMessagePayload,
	PluginType,
	PostMessageAction,
	ValidateMessagePayload,
} from '@/types';
import {
	APP_BRIDGE_ORIGIN,
	KEY_PARENT_HOST,
	KEY_SLUG,
	KEY_TOKEN,
	KEY_VALIDATED_PAYLOAD,
} from '@/utils/const';
import { useState, useEffect } from 'react';

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
	type,
	authenticated,
}: {
	type: PluginType;
	authenticated: () => Promise<void>;
}) => {
	const [status, setStatus] = useState<
		'init' | 'authenticating' | 'authenticated' | 'error'
	>('init');
	const [error, setError] = useState<unknown>();

	const init = async () => {
		const isInIframe = window.top !== window.self;

		if (!isInIframe) {
			setStatus('error');
			setError('not-in-iframe');
			return;
		}

		if (!isAuthenticated()) {
			sendValidateMessageToParent();
			return;
		}

		setStatus('authenticated');
		setError(undefined);

		await authenticated();
	};

	const isAuthenticated = () => {
		try {
			const payload: AppBridgeSession = JSON.parse(
				sessionStorage.getItem(KEY_VALIDATED_PAYLOAD) || '',
			);
			return payload && new Date().getTime() / 1000 < payload.exp;
		} catch (_err) {
			return false;
		}
	};

	const sendValidateMessageToParent = () => {
		setStatus('authenticating');
		setError(undefined);
		const host = getParentHost();
		const slug = getSlug();

		try {
			const payload = createValidateMessagePayload({ type, slug });

			postMessageToParent(payload);
			sessionStorage.setItem(KEY_PARENT_HOST, host);
			sessionStorage.setItem(KEY_SLUG, slug || '');
		} catch (err) {
			sessionStorage.removeItem(KEY_PARENT_HOST);
			sessionStorage.removeItem(KEY_SLUG);
			setError('Failed to request validation.');
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
		if (event.origin !== APP_BRIDGE_ORIGIN) {
			// This can happen for many different reasons,
			// like a React DevTools extension, etc.
			return;
		}

		if (event.data.action === 'validated') {
			const token = event.data.token;
			try {
				const response = await (
					await fetch('/api/_app_bridge', {
						method: 'POST',
						body: JSON.stringify({ token }),
					})
				).json();

				if (response.ok) {
					sessionStorage.setItem(KEY_TOKEN, token);
					sessionStorage.setItem(
						KEY_VALIDATED_PAYLOAD,
						JSON.stringify(response.result),
					);
					setStatus('authenticated');
					setError(undefined);
					await authenticated();
				} else {
					sessionStorage.removeItem(KEY_TOKEN);
					sessionStorage.removeItem(KEY_VALIDATED_PAYLOAD);
					setStatus('error');
					setError(response.error);
				}
			} catch (err) {
				sessionStorage.removeItem(KEY_TOKEN);
				sessionStorage.removeItem(KEY_VALIDATED_PAYLOAD);
				setStatus('error');
				setError(err);
			}
		}
	};

	useEffect(() => {
		// Adds event listener to listen to events coming from Storyblok to Iframe (plugin)
		window.addEventListener('message', eventListener);

		return () => {
			window.removeEventListener('message', eventListener);
		};
	}, []);

	return { status, init, error };
};

const useOAuth = ({ type }: { type: PluginType }) => {
	const [status, setStatus] = useState<
		'init' | 'authenticating' | 'authenticated'
	>('init');

	const init = async () => {
		setStatus('authenticating');

		const initOAuth =
			new URLSearchParams(location.search).get('init_oauth') === 'true';

		const response = await (
			await fetch('/api/_oauth', {
				method: 'POST',
				body: JSON.stringify({ initOAuth }),
			})
		).json();

		if (response.ok) {
			setStatus('authenticated');
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

export const useAppBridge = ({
	type,
	oauth,
}: {
	type: PluginType;
	oauth: boolean;
}) => {
	const { init: initOAuth, status: oauthStatus } = useOAuth({ type });

	const { init: initAppBridgeAuth, status: appBridgeAuthStatus } =
		useAppBridgeAuth({
			type,
			authenticated: async () => {
				if (oauth) {
					await initOAuth();
				}
			},
		});

	const completed = oauth
		? appBridgeAuthStatus === 'authenticated' && oauthStatus === 'authenticated'
		: appBridgeAuthStatus === 'authenticated';

	useEffect(() => {
		initAppBridgeAuth();
	}, [type, oauth]);

	return {
		completed,
		appBridgeAuth: appBridgeAuthStatus,
		oauth: oauthStatus,
		getSlug,
		getParentHost,
	};
};
