export type AppBridgeConfig = {
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
