import { randomBytes } from 'node:crypto';
import {
	UpsertStoryblokWebhook,
	DeleteStoryblokWebhook,
	StoryblokWebhookResponse,
	StoryblokWebhookEventCategory,
	IsValidWebhookUpsertParams,
	CreateStoryblokWebhook,
	UpdateStoryblokWebhook,
	GetStoryblokWebhook,
} from '../../types';

export const generateSecret = (lengthInBytes: number = 20) => {
	return randomBytes(lengthInBytes).toString('base64url');
};

export const createStoryblokWebhook: CreateStoryblokWebhook = async (params) =>
	upsertStoryblokWebhook('create', params);

export const updateStoryblokWebhook: UpdateStoryblokWebhook = async (params) =>
	upsertStoryblokWebhook('update', params);

export const deleteStoryblokWebhookById: DeleteStoryblokWebhook = async (
	params,
) => {
	const apiHost = getManagementApiHost(params.spaceId);

	const url = `${apiHost}/v1/spaces/${params.spaceId}/webhook_endpoints/${params.webhookId}`;

	try {
		await $fetch(url, {
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
			},
			method: 'DELETE',
		});

		return {
			ok: true,
			result: 'Webhook deleted',
		};
	} catch (err: any) {
		return {
			ok: false,
			error: 'could-not-delete-webhook',
		};
	}
};

export const inferEventCategoryFromBody = (
	body: any,
): StoryblokWebhookEventCategory | undefined => {
	if (body.workflow_name) {
		return 'workflow';
	} else if (body.datasource_slug) {
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

export const getStoryblokWebhookById: GetStoryblokWebhook = async (params) => {
	const apiHost = getManagementApiHost(params.spaceId);

	const url = `${apiHost}/v1/spaces/${params.spaceId}/webhook_endpoints/${params.webhookId}`;

	try {
		const result = await $fetch<StoryblokWebhookResponse>(url, {
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
			},
			method: 'GET',
		});

		return {
			ok: true,
			result,
		};
	} catch (err: any) {
		return {
			ok: false,
			error: 'could-not-delete-webhook',
		};
	}
};

const upsertStoryblokWebhook: UpsertStoryblokWebhook = async (
	operation,
	params,
) => {
	const isParamsValid = isValidWebhookUpsertParams(operation, params);

	if (!isParamsValid) {
		return {
			ok: false,
			error: 'invalid-parameters',
		};
	}

	const apiHost = getManagementApiHost(params.spaceId);

	const url = `${apiHost}/v1/spaces/${params.spaceId}/webhook_endpoints/${
		operation === 'update' ? params.id : ''
	}`;

	try {
		const result: StoryblokWebhookResponse =
			await $fetch<StoryblokWebhookResponse>(url, {
				headers: {
					Authorization: `Bearer ${params.accessToken}`,
				},
				method: operation === 'create' ? 'POST' : 'PUT',
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
			error: err.data ?? 'unknown',
		};
	}
};

const isValidWebhookUpsertParams: IsValidWebhookUpsertParams = (
	operation,
	{ spaceId, accessToken, id, name, endpoint, actions },
) => {
	const isSpaceIdValid = typeof spaceId === 'number' && spaceId > 0;

	const isAccessTokenValid =
		typeof accessToken === 'string' && accessToken.length > 0;

	const isIdValid =
		(typeof id === 'number' && id > 0) || operation === 'create';

	const isNameValid =
		(typeof name === 'string' && name.length > 0) ||
		(operation === 'update' && typeof name === 'undefined');

	const isEndpointValid =
		(typeof endpoint === 'string' && endpoint.length > 0) ||
		(operation === 'update' && typeof endpoint === 'undefined');

	const isActionsValid =
		(Array.isArray(actions) && actions.length > 0) ||
		(operation === 'update' && typeof actions === 'undefined');

	return (
		isSpaceIdValid &&
		isAccessTokenValid &&
		isIdValid &&
		isNameValid &&
		isEndpointValid &&
		isActionsValid
	);
};
