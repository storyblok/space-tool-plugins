export default defineEventHandler(async (event): Promise<OAuthResponse> => {
	const appConfig = useAppConfig();
	const appSession = await getAppSession(event);
	if (appSession) {
		event.context.appSession = appSession;
		return {
			ok: true,
		};
	} else {
		return {
			ok: false,
			redirectTo: appConfig.auth.initOauthFlowUrl,
		};
	}
});

type OAuthResponse =
	| {
			ok: true;
	  }
	| {
			ok: false;
			redirectTo: string;
	  };
