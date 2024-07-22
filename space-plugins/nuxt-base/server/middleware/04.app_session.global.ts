// By having this separate middleware,
// we set appSession to event.contenxt for
// - plugins that use oauth only
// - plugins that use appBridge and oauth altogether
export default defineEventHandler(async (event) => {
	const appConfig = useAppConfig();

	const appSession = await getAppSession(event);
	event.context.appSession = appSession;

	const afterAuthenticated = appConfig.auth.middleware?.afterAuthenticated;
	if (typeof afterAuthenticated === 'function' && appSession) {
		return await afterAuthenticated({ event, appSession });
	}
});
