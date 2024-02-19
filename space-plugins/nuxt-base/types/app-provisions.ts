type AppDetails = {
	app_provision: AppProvisions;
	app: App;
	granted: boolean;
};

type App = {
	id: number | string;
	name: string;
	slug: string;
	icon: string | null;
	plan_level: number | null;
	preview_video: string | null;
	app_url: null;
	description: string | null;
	intro: string | null;
	screenshot: string | null;
	status: string;
	website: string | null;
	author: string | null;
	updated_at: string;
	field_type_ids: number[];
	embedded_app_url: string | null;
	dev_embedded_app_url: string | null;
	dev_oauth_redirect_uri: string | null;
	in_sidebar: boolean;
	in_toolbar: boolean;
	sidebar_icon: string | null;
	enable_space_settings: boolean;
};

type AppProvisions = {
	public_config: null;
	session: null;
	slug: string;
	app_id: number | string;
	name: string;
	in_sidebar: boolean;
	in_toolbar: boolean;
	sidebar_icon: string | null;
	enable_space_settings: boolean;
	space_level_settings: AppSettings;
};

type AppSettings = Record<string, string>;
