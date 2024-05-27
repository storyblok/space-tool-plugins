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

export type StoryblokWebhookParams = {
	spaceId: number;
	accessToken: string;
};

//#region get
export type GetStoryblokWebhookParams = StoryblokWebhookParams & {
	webhookId: number;
};

export type GetStoryblokWebhookResponse =
	| { ok: true; result: StoryblokWebhookResponse }
	| { ok: false; error: any };

export type GetStoryblokWebhook = (
	params: GetStoryblokWebhookParams,
) => Promise<GetStoryblokWebhookResponse>;

//#endregion

//#region saving
export type UpsertStoryblokWebhookParams = StoryblokWebhookParams & {
	id?: number;
	name?: string;
	description?: string;
	endpoint?: string;
	actions?: string[];
	activated?: boolean;
	isLegacy?: boolean;
	secret?: string;
};

export type StoryblokWebhookUpsertError =
	| 'limit-exceeded'
	| 'name-already-exists'
	| 'invalid-parameters'
	| 'unknown';

export type UpsertOperation = 'create' | 'update';

export type UpsertStoryblokWebhookResponse =
	| { ok: true; result: StoryblokWebhookResponse }
	| { ok: false; error: StoryblokWebhookUpsertError };

export type UpsertStoryblokWebhook = (
	operation: UpsertOperation,
	params: UpsertStoryblokWebhookParams,
) => Promise<UpsertStoryblokWebhookResponse>;

export type CreateStoryblokWebhook = (
	params: UpsertStoryblokWebhookParams,
) => Promise<UpsertStoryblokWebhookResponse>;

export type UpdateStoryblokWebhook = (
	params: UpsertStoryblokWebhookParams,
) => Promise<UpsertStoryblokWebhookResponse>;
//#endregion

//#region delete
export type DeleteStoryblokWebhookParams = StoryblokWebhookParams & {
	webhookId: number;
};

export type StoryblokWebhookDeletionError = 'could-not-delete-webhook';

export type DeleteStoryblokWebhookResponse =
	| { ok: true; result: string }
	| { ok: false; error: StoryblokWebhookDeletionError };

export type DeleteStoryblokWebhook = (
	params: DeleteStoryblokWebhookParams,
) => Promise<DeleteStoryblokWebhookResponse>;
//#endregion

//#region validation
export type IsValidWebhookUpsertParams = (
	operation: UpsertOperation,
	params: UpsertStoryblokWebhookParams,
) => boolean;
//#endregion
