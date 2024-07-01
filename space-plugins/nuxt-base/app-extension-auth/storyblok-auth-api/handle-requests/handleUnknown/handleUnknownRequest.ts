import type { AuthHandlerParams } from '../../AuthHandlerParams';
import type { HandleAuthRequest } from '../HandleAuthRequest';
import { clearCallbackData } from '~/app-extension-auth/storyblok-auth-api/handle-requests/callbackData';

export const handleUnknownRequest: HandleAuthRequest<{
	params: AuthHandlerParams;
}> = async ({ params }) => ({
	type: 'error',
	redirectTo: params.errorCallback,
	sessions: [clearCallbackData],
});
