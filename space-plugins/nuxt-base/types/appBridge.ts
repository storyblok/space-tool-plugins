export type AppBridgeConfig = {
	type: PluginType;
	enabled: boolean;
	oauth: boolean;
	origin: string;
};

export type VerifyResponse =
	| { ok: true; result: DecodedToken }
	| { ok: false; error: unknown };

export type DecodedToken = {
	app_id: number;
	space_id: number;
	user_id: number;
	iat: number;
	exp: number;
};

export type PluginType = 'space-plugin' | 'tool-plugin';

export type UseAppBridgeParams = {
	type: PluginType;
};

export type UseAppBridgeMessagesParams = {
	type: PluginType;
};
