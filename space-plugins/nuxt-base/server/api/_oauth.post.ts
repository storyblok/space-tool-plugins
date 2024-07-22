export default defineEventHandler(async (event): Promise<OAuthResponse> => {
	const appConfig = useAppConfig();
	const { initOAuth } = await readBody(event);
	if (initOAuth) {
		return {
			ok: false,
			redirectTo: appConfig.auth.initOauthFlowUrl,
		};
	}

	const appSession = await getAppSession(event);
	if (appSession) {
		event.context.appSession = appSession;
		return {
			ok: true,
		};
	}

	return {
		ok: false,
		redirectTo: appConfig.auth.initOauthFlowUrl,
	};
});

type OAuthResponse =
	| {
			ok: true;
	  }
	| {
			ok: false;
			redirectTo: string;
	  };
