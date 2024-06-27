import type { AppSession } from '../types';

export type AppSessionQuery = Record<
	keyof Pick<AppSession, 'spaceId' | 'userId'>,
	string | number
>;
