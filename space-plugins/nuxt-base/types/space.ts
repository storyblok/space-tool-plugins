export type FetchSpaceInfoParams = {
	spaceId: number;
	accessToken: string;
};

export type FetchSpaceInfo = (
	params: FetchSpaceInfoParams,
) => Promise<FetchSpaceInfoResponse>;

export type FetchSpaceInfoResponse =
	| { ok: true; result: SpaceInfo }
	| { ok: false; error: FetchSpaceInfoError };

export type FetchSpaceInfoError = 'could-not-fetch-space-info';

export type SpaceInfo = {
	id: number;
	name: string;
	domain: string;
	plan_level: number;
	owner: {
		id: number;
		email: string;
		created_at: string;
		updated_at: string;
		access_token: string;
		username: string | null;
		role: string;
		sso: boolean;
		firstname: string;
		lastname: string;
		euid: string | null;
		encrypted_otp_secret: string;
		encrypted_otp_secret_iv: string;
		encrypted_otp_secret_salt: string;
		consumed_timestep: number;
		otp_required_for_login: boolean;
		login_strategy: string;
		phone: string | null;
		alt_email: string | null;
		use_username: boolean;
		organization: string | null;
		org_id: number;
		org_role: string;
		timezone: string;
		disabled: boolean;
		notified: string[];
		avatar: string | null;
		deleted_at: string | null;
		lang: string;
		email_mapping: string | null;
		preferences: {
			job_role: string;
			beta_user: boolean;
			is_editor: boolean;
			favourite_ideas: any[];
			favourite_spaces: number[];
			track_statistics: boolean;
			first_space_created: boolean;
		};
		partner_id: number;
		partner_role: string;
		otp_secret: string;
	};
	languages: {
		code: string;
		name: string;
	}[];
};
