import { randomBytes } from 'node:crypto';
import { US_CODE, getRegion } from '@storyblok/region-helper';
import {
	CreateStoryblokWebhook,
	IsValidWebhookCreationParams,
	StoryblokWebhookCreationResponse,
	StoryblokWebhookEventCategory,
} from '../../types';

export const generateSecret = (lengthInBytes: number = 20) => {
	return randomBytes(lengthInBytes).toString('base64url');
};

export const createStoryblokWebhook: CreateStoryblokWebhook = async (
	params,
) => {
	const isParamsValid = isValidWebhookCreationParams(params);

	if (!isParamsValid) {
		return {
			ok: false,
			error: 'invalid-parameters',
		};
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

		return {
			ok: true,
			result,
		};
	} catch (err: any) {
		if (
			err.status === 422 &&
			err.data?.base?.includes('Webhook limit exceeded')
		) {
			return {
				ok: false,
				error: 'limit-exceeded',
			};
		}
		if (
			err.status === 422 &&
			err.data?.name?.includes('has already been taken')
		) {
			return {
				ok: false,
				error: 'name-already-exists',
			};
		}
		return {
			ok: false,
			error: 'unknown',
		};
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

const isValidWebhookCreationParams: IsValidWebhookCreationParams = ({
	name,
	spaceId,
	accessToken,
	endpoint,
	actions,
}) => {
	const isNameValid = typeof name === 'string' && name.length > 0;
	const isSpaceIdValid = typeof spaceId === 'number' && spaceId > 0;
	const isEndpointValid = typeof endpoint === 'string' && endpoint.length > 0;
	const isActionsValid = Array.isArray(actions) && actions.length > 0;
	const isAccessTokenValid =
		typeof accessToken === 'string' && accessToken.length > 0;

	return (
		isNameValid &&
		isSpaceIdValid &&
		isAccessTokenValid &&
		isEndpointValid &&
		isActionsValid
	);
};
