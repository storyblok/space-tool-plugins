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

//#region saving
export type SaveStoryblokWebhookParams = StoryblokWebhookParams & {
	id?: number;
	name?: string;
	description?: string;
	endpoint?: string;
	actions?: string[];
	activated?: boolean;
	isLegacy?: boolean;
	secret?: string;
};

export type StoryblokWebhookSaveError =
	| 'limit-exceeded'
	| 'name-already-exists'
	| 'invalid-parameters'
	| 'unknown';

export type SaveOperation = 'create' | 'update';

export type SaveStoryblokWebhookResponse =
	| { ok: true; result: StoryblokWebhookResponse }
	| { ok: false; error: StoryblokWebhookSaveError };

export type SaveStoryblokWebhook = (
	operation: SaveOperation,
	params: SaveStoryblokWebhookParams,
) => Promise<SaveStoryblokWebhookResponse>;

export type CreateStoryblokWebhook = (
	params: SaveStoryblokWebhookParams,
) => Promise<SaveStoryblokWebhookResponse>;

export type UpdateStoryblokWebhook = (
	params: SaveStoryblokWebhookParams,
) => Promise<SaveStoryblokWebhookResponse>;
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
export type IsValidWebhookSaveParams = (
	operation: SaveOperation,
	params: SaveStoryblokWebhookParams,
) => boolean;
//#endregion
