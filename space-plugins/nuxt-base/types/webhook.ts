import type { Result } from './result';
import {
	array,
	boolean,
	minLength,
	number,
	object,
	optional,
	string,
	url,
} from 'valibot';

export type StoryblokWebhookCreationError =
	| 'limit-exceeded'
	| 'name-already-exists'
	| 'missing-parameters'
	| 'unknown';

export type CreateStoryblokWebhookResponse = Result<
	{ webhookId: number },
	{ type: StoryblokWebhookCreationError; details?: string[] }
>;

export type CreateStoryblokWebhook = (params: {
	name: string;
	description?: string;
	endpoint: string;
	actions: string[];
	activated?: boolean;
	isLegacy?: boolean;
	secret?: string;
	spaceId: number;
	accessToken: string;
}) => Promise<CreateStoryblokWebhookResponse>;

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

export type StoryblokWebhookEventCategory =
	| 'workflow'
	| 'datasource'
	| 'release'
	| 'pipeline'
	| 'user'
	| 'asset'
	| 'story';

export const CreateStoryblokWebhookSchema = object({
	name: string([minLength(1)]),
	description: optional(string()),
	endpoint: string([url()]),
	actions: array(string(), [minLength(1)]),
	activated: optional(boolean()),
	isLegacy: optional(boolean()),
	secret: optional(string([minLength(1)])),
	spaceId: number(),
	accessToken: string([minLength(1)]),
});
