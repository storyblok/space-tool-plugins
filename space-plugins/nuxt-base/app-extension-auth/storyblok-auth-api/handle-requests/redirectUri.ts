import { trimSlashes } from '../../utils';
import type { AuthHandlerParams } from '../AuthHandlerParams';
import { callbackEndpoint } from './callbackEndpoint';

export const redirectUri = (
	params: Pick<AuthHandlerParams, 'baseUrl' | 'endpointPrefix'>,
) =>
	[params.baseUrl, params.endpointPrefix ?? '', callbackEndpoint]
		.map(trimSlashes)
		.filter((str) => str !== '')
		.join('/');
