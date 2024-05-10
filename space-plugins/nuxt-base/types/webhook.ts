/* -- Storyblok Webhook shapes -- */
export type StoryblokWebhook = {
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

export type StoryblokWebhookEventCategory =
	| 'workflow'
	| 'datasource'
	| 'release'
	| 'pipeline'
	| 'user'
	| 'asset'
	| 'story';

export type StoryblokWebhookResponse = {
	webhook_endpoint: StoryblokWebhook;
};

export type StoryblokWebhooksListResponse = {
	webhook_endpoints: StoryblokWebhook[];
};

/* -- Storyblok Webhook request parameters -- */
export type StoryblokWebhookParams = {
	spaceId: number;
	accessToken: string;
}

export type CreateStoryblokWebhookParams = StoryblokWebhookParams & {
	name: string;
	description?: string;
	endpoint: string;
	actions: string[];
	activated?: boolean;
	isLegacy?: boolean;
	secret?: string;
};

export type DeleteStoryblokWebhookParams = StoryblokWebhookParams & {
	webhookId: number;
};

/* -- Storyblok Webhook responses -- */
// Creation
export type StoryblokWebhookCreationError =
	| 'limit-exceeded'
	| 'name-already-exists'
	| 'invalid-parameters'
	| 'unknown';

export type CreateStoryblokWebhookResponse =
	| { ok: true; result: StoryblokWebhookResponse }
	| { ok: false; error: StoryblokWebhookCreationError };

export type CreateStoryblokWebhook = (
	params: CreateStoryblokWebhookParams,
) => Promise<CreateStoryblokWebhookResponse>;

export type IsValidWebhookCreationParams = (
	params: CreateStoryblokWebhookParams,
) => boolean;

// Fetch all
export type StoryblokWebhookFetchAllError = 'could-not-fetch-webhooks';

export type FetchAllStoryblokWebhookResponse =
	| { ok: true; result: StoryblokWebhooksListResponse }
	| { ok: false; error: StoryblokWebhookFetchAllError };

export type FetchAllStoryblokWebhooks = (
	params: StoryblokWebhookParams,
) => Promise<FetchAllStoryblokWebhookResponse>;

// Deletion
export type StoryblokWebhookDeletionError = 'could-not-delete-webhook';

export type DeleteStoryblokWebhookResponse =
	| { ok: true; result: string }
	| { ok: false; error: StoryblokWebhookDeletionError };

export type DeleteStoryblokWebhook = (
	params: DeleteStoryblokWebhookParams,
) => Promise<DeleteStoryblokWebhookResponse>;