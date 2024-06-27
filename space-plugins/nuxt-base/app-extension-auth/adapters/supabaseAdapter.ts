import type { Adapter } from '~/app-extension-auth';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const suapabseAdapter = (id: string, secret: string): Adapter => {
	const supabaseClient = null;
	return {
		getItem: ({
			req,
			key,
		}: {
			req: IncomingMessage;
			res: ServerResponse;
			key: string;
		}) => {},
		setItem: ({
			req,
			res,
			key,
			value,
		}: {
			req: IncomingMessage;
			res: ServerResponse;
			key: string;
			value: string | object;
		}) => {},
		hasItem: ({
			req,
			res,
			key,
		}: {
			req: IncomingMessage;
			res: ServerResponse;
			key: string;
		}) => {
			return true;
		},
		removeItem: ({
			res,
			key,
		}: {
			req: IncomingMessage;
			res: ServerResponse;
			key: string;
		}) => {},
	};
};
