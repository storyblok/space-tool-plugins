import { randomBytes } from 'node:crypto';
import { US_CODE, getRegion } from '@storyblok/region-helper';
import { safeParse } from 'valibot';
import {
	CreateStoryblokWebhook,
	StoryblokWebhookCreationResponse,
	StoryblokWebhookEventCategory,
	CreateStoryblokWebhookSchema,
} from '../../types';

export const generateSecret = (lengthInBytes: number = 20) => {
	return randomBytes(lengthInBytes).toString('base64url');
};

export const createStoryblokWebhook: CreateStoryblokWebhook = async (
	params,
) => {
	const parsed = safeParse(CreateStoryblokWebhookSchema, params);

	if (!parsed.success) {
		return failure({
			type: 'missing-parameters',
			details: parsed.issues.map((issue) => issue.message),
		});
	}

	const apiHost =
		getRegion(params.spaceId) === US_CODE
			? 'https://api-us.storyblok.com'
			: 'https://mapi.storyblok.com';

	const url = `${apiHost}/v1/spaces/${params.spaceId}/webhook_endpoints`;

	try {
		const result: StoryblokWebhookCreationResponse = await $fetch(url, {
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
			},
			method: 'POST',
			body: {
				name: params.name,
				description: params.description,
				endpoint: params.endpoint,
				secret: params.secret,
				actions: params.actions,
				activated: params.activated ?? true,
				isLegacy: params.isLegacy ?? false,
			},
		});

		const webhookId = result.webhook_endpoint.id;

		return success({ webhookId });
	} catch (err: any) {
		if (
			err.status === 422 &&
			err.data?.base?.includes('Webhook limit exceeded')
		) {
			return failure({ type: 'limit-exceeded' });
		}
		if (
			err.status === 422 &&
			err.data?.name?.includes('has already been taken')
		) {
			return failure({ type: 'name-already-exists' });
		}

		return failure({ type: 'unknown' });
	}
};

export const inferEventCategoryFromBody = (
	body: any,
): StoryblokWebhookEventCategory | undefined => {
	if (body.workflow_name) {
		return 'workflow';
	} else if (body.datasource_slugs) {
		return 'datasource';
	} else if (body.release_id) {
		return 'release';
	} else if (body.branch_id) {
		return 'pipeline';
	} else if (body.user_id) {
		return 'user';
	} else if (body.asset_id) {
		return 'asset';
	} else if (body.story_id) {
		return 'story';
	}
};
