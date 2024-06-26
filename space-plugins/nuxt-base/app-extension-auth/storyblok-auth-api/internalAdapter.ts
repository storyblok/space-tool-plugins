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
	async getItem(key) {
		return await adapter.getItem({
			req,
			res,
			key,
		});
	},
	async setItem({ key, value }) {
		return await adapter.setItem({
			req,
			res,
			key,
			value,
		});
	},
	async hasItem(key) {
		return await adapter.hasItem({
			req,
			res,
			key,
		});
	},
	async removeItem(key) {
		return await adapter.removeItem({
			req,
			res,
			key,
		});
	},
});
