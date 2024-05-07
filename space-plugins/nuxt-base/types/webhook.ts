export type StoryblokWebhookCreationError =
	| 'limit-exceeded'
	| 'name-already-exists'
	| 'invalid-parameters'
	| 'unknown';

export type CreateStoryblokWebhookResponse =
	| { ok: true; result: StoryblokWebhookCreationResponse }
	| { ok: false; error: StoryblokWebhookCreationError };

export type CreateStoryblokWebhookParams = {
	name: string;
	description?: string;
	endpoint: string;
	actions: string[];
	activated?: boolean;
	isLegacy?: boolean;
	secret?: string;
	spaceId: number;
	accessToken: string;
};

export type CreateStoryblokWebhook = (
	params: CreateStoryblokWebhookParams,
) => Promise<CreateStoryblokWebhookResponse>;

export type StoryblokWebhookCreationResponse = {
	webhook_endpoint: {
		id: number;
		name: string;
		description: string | null;
		endpoint: string;
		space_id: number;
		secret: string;
		actions: string[];
		activated: boolean;
		deleted_at: string | null;
		created_at: string;
		updated_at: string;
	};
};

export type IsValidWebhookCreationParams = (
	params: CreateStoryblokWebhookParams,
) => boolean;

export type StoryblokWebhookEventCategory =
	| 'workflow'
	| 'datasource'
	| 'release'
	| 'pipeline'
	| 'user'
	| 'asset'
	| 'story';
