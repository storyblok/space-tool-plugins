import { AuthHandlerParams } from '../../AuthHandlerParams';
import { HandleAuthRequest } from '../HandleAuthRequest';

import { clearCallbackCookieElement } from '../callbackCookie';

export const handleUnknownRequest: HandleAuthRequest<{
	params: AuthHandlerParams;
}> = async ({ params }) => ({
	type: 'error',
	redirectTo: params.errorCallback,
	setCookies: [clearCallbackCookieElement],
});
