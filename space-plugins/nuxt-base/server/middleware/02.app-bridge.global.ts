export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();
	if (!appConfig.appBridge.auth) {
		return;
	}
	// TODO: check if already authenticated
	return await sendRedirect(event, appConfig.auth.initOauthFlowUrl, 302);
});
