import { getAuthHandlerParams } from '../../utils/auth';
import { authHandler } from '~/app-extension-auth';

export default defineEventHandler((event) => {
	const appConfig = useAppConfig();
	return authHandler(getAuthHandlerParams(appConfig.auth))(
		event.node.req,
		event.node.res,
	);
});
