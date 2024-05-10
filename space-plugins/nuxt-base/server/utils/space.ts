import { FetchSpaceInfo } from '~/types/space';

export const deleteStoryblokWebhookByIddd: DeleteStoryblokWebhook = async (
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

export const fetchSpaceInfo: FetchSpaceInfo = async ({
	spaceId,
	accessToken,
}) => {
	const apiHost = getManagementApiHost(spaceId);
	const url = `${apiHost}/v1/oauth/space_info`;

	try {
		const result = (
			(await $fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})) as any
		).space;

		return {
			ok: true,
			result,
		};
	} catch (err: any) {
		return {
			ok: false,
			error: 'could-not-fetch-space-info',
		};
	}
};
