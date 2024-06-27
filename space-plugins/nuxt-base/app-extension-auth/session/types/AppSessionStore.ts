import type { AppSessionQuery } from './AppSessionKeys';
import type { AppSession } from './AppSession';

export type AppSessionStore = {
	get: (
		keys: AppSessionQuery,
		options?: {
			autoRefresh?: boolean;
		},
	) => Promise<AppSession | undefined>;
	getAll: () => Promise<AppSession[]>;
	put: (session: AppSession) => Promise<AppSession | undefined>;
	remove: (keys: AppSessionQuery) => Promise<AppSession | undefined>;
};
