import http from 'http';
import type { ResponseElement } from './ResponseElement';
import type { InternalAdapter } from '.';

/**
 * Writes the changes described by a `ResponseElement` into a Node `http.ServerResponse`.
 * @param res
 * @param responseElement
 */
export const reconcileNodeResponse = async ({
	res,
	responseElement,
	adapter,
}: {
	res: http.ServerResponse;
	responseElement: ResponseElement;
	adapter: InternalAdapter;
}) => {
	if (responseElement.type === 'configuration-error') {
		console.error(
			`@stoyblok/app-extension-auth is misconfigured: ${
				responseElement.message ?? ''
			}`,
		);
	}
	if (responseElement.type === 'error' && responseElement.message) {
		console.error(responseElement.message);
	}

	for (const { name, value } of responseElement.sessions ?? []) {
		if (typeof value === 'undefined') {
			await adapter.removeItem(name);
		} else {
			await adapter.setItem({ key: name, value });
		}
	}

	res
		.writeHead(302, {
			Location: responseElement.redirectTo,
		})
		.end();
};
