import http from 'http';
import type { Adapter, InternalAdapter } from '.';

export const createInternalAdapter = ({
	req,
	res,
	adapter,
}: {
	req: http.IncomingMessage;
	res: http.ServerResponse;
	adapter: Adapter;
}): InternalAdapter => ({
	getItem(key) {
		return adapter.getItem({
			req,
			res,
			key,
		});
	},
	setItem({ key, value }) {
		return adapter.setItem({
			req,
			res,
			key,
			value,
		});
	},
	hasItem(key) {
		return adapter.hasItem({
			req,
			res,
			key,
		});
	},
	removeItem(key) {
		return adapter.removeItem({
			req,
			res,
			key,
		});
	},
});
