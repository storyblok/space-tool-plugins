import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
	process.env.SUPABASE_URL || '',
	process.env.SUPABASE_KEY || '',
);

type AppSession = {
	appClientId: string;
	userId: string | number;
	spaceId: string | number;
	refreshToken: string;
	accessToken: string;
	expiresAt: number;
	roles: string[];
	spaceName: string;
	userName: string;
	region: string;
};

type GetSessionParams = Pick<AppSession, 'spaceId' | 'userId' | 'appClientId'>;

type SetSession = (session: AppSession) => Promise<void>;
type GetSession = (params: GetSessionParams) => Promise<void>;

export type Adapter = {
	getSession: GetSession;
	setSession: SetSession;
};

// ADD: update session to supabase?
// ADD: isSessionValid?
export const createSupabaseClient = (url: string, key: string): Adapter => {
	const supabaseClient = createClient(url || '', key || '');

	const setSession: SetSession = async (session) => {
		const {
			spaceId,
			spaceName,
			userName,
			userId,
			region,
			refreshToken,
			roles,
			expiresAt,
			appClientId,
			accessToken,
		} = session;

		const { data, error } = await supabaseClient
			.from('session_kv_test')
			.upsert({
				space_id: spaceId,
				user_id: userId,
				app_client_id: appClientId,
				key: 'session',
				value: {
					refresh_token: refreshToken,
					access_token: accessToken,
					expires_at: new Date(expiresAt).toISOString(),
					roles,
					space_name: spaceName,
					user_name: userName,
					region,
				},
			});

		console.log('error', error);
	};

	const isSessionExpired = (session: AppSession) => {
		session;
	};

	const getSession: GetSession = async (params) => {
		//TODO: refresh session
		const { spaceId, userId, appClientId } = params;
		const { data, error } = await supabaseClient
			.from('session_test')
			.select()
			.eq('space_id', spaceId)
			.eq('user_id', userId)
			.eq('app_client_id', appClientId);

		console.log('error', error);
	};

	return {
		getSession,
		setSession,
	};
};

const cookieAdapter = () => {
	return {
		getSession: null,
		setSession: null,
	};
};

export const supabaseAdapter = createSupabaseAdapter(
	process.env.SUPABASE_URL || '',
	process.env.SUPABASE_KEY || '',
);
