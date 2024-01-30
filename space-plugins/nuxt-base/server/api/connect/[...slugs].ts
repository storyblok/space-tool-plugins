import { authHandler } from '@storyblok/app-extension-auth';
import { getAuthHandlerParams } from '../../utils/auth';

export default defineEventHandler((event) => {
	const appConfig = useAppConfig();
	return authHandler(getAuthHandlerParams(appConfig.auth))(
		event.node.req,
		event.node.res
	);
});
